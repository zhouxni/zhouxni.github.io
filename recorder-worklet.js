class RecorderWorklet extends AudioWorkletProcessor {
  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (input.length > 0) {
      const pcm = input[0];

      // 音量放大倍数，自己调
      const volumeGain = 8.0;

      // 复制一份并放大音量
      const amplified = new Float32Array(pcm.length);
      for (let i = 0; i < pcm.length; i++) {
        amplified[i] = pcm[i] * volumeGain;
      }

      // 发送放大后的 PCM
      this.port.postMessage({ pcm: amplified });
    }
    return true;
  }
}

registerProcessor('recorder-worklet', RecorderWorklet);