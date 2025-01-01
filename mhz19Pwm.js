const pigpio = require('pigpio');
const Gpio = pigpio.Gpio;

class Mhz19Pwm {
  _lastTick = 0;  // 前回のエッジが発生した時刻 (μs)
  _lastLevel = 0; // 前回のGPIOレベル (0 or 1)
  _lastFallingEdgeTick = 0; // 前回の立ち上がりした時刻 (μs)
  _lastCO2 = 0;   // ppm

  constructor(pin) {
    // MH-Z19 の PWM 出力を受ける GPIO
    const sensorPin = new Gpio(pin, {
      mode: Gpio.INPUT, // GPIO ピンを入力モードに設定
      alert: true, // エッジ（High→Low または Low→High）検出を有効化。
      pullUpDown: Gpio.PUD_DOWN // ピンが未接続時に Low に固定される設定
    });
    sensorPin.on('alert', this._handleAlert.bind(this));
  }

  /**
   * エッジ検出時
   * alert イベントは GPIO ピンの状態（High/Low）が変化するたびに呼び出されます。
   * @param level 現在の GPIO レベル（0: Low, 1: High）
   * @param tick pigpio によって記録されたエッジのタイムスタンプ（マイクロ秒単位）
   */
  _handleAlert(level, tick) {
    console.info("aaaaa")
    // pigpioは 'tick' をマイクロ秒(μs)単位のタイムスタンプで渡してくれる
    if (this._lastTick === 0) {
      console.info("bbbb")
      // 初回のエッジは比較できる過去がないので記録だけ
      this._lastTick = tick;
      this._lastLevel = level;
      return;
    }

    // パルス計測用
    let tHigh = 0;       // 今回のパルスのHigh継続時間 (μs)
    let tPeriod = 0;     // パルス周期 (High + Low) (μs)

    // 現在のエッジと前回のエッジ間の時間差を計算 (μs)
    const diff = tick - this._lastTick;

    // 前回が High (1) で今回が Low (0) = 下降エッジ
    if (this._lastLevel === 1 && level === 0) {
      // High だった時間が diff に相当
      tHigh = diff;
    }

    // 周期の測定には、たとえば「前回の立ち下がり→今回の立ち下がり」を1周期とみなせます
    const isFallingEdge = level === 0;
    if (isFallingEdge) {
      // 立ち下がりエッジに来たら、前回の立ち下がりとの間隔が1周期
      const currentFallingEdgeTick = tick;
      if (this._lastFallingEdgeTick !== 0) {
        tPeriod = currentFallingEdgeTick - this._lastFallingEdgeTick;
        // CO2 計算
        const co2ppm = this._calcCO2(tHigh, tPeriod);
        if (co2ppm > 0) {
          console.log(`CO2: ${co2ppm} ppm (T_high=${tHigh}µs, T_period=${tPeriod}µs)`);
          this._lastCO2 = co2ppm;
        }
      }
      this._lastFallingEdgeTick = tick;
    }

    // 次回計測のために記録
    this._lastTick = tick;
    this._lastLevel = level;
  }

  /**
   * CO2 濃度計算
   * ここでは 0-5000ppm モデルを想定
   * @param highUs highだった時間
   * @param periodUs 周期の時間
   */
  _calcCO2(highUs, periodUs) {
    if (periodUs === 0) return -1;
    // μs → ms にしたい場合は /1000
    // データシートによっては 5000ppm 用か 2000ppm 用か違うので調整
    // 例: CO2 = 5000 * (T_high / T_period)
    return Math.round(5000 * (highUs / periodUs));
  }
}
exports.Mhz19Pwm = Mhz19Pwm;