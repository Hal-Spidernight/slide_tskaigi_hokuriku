async function handlingError() {
  console.log('Start error test')
  await stackTraceErrorTest()
}

async function stackTraceErrorTest() {
  try {
    await sample()
  } catch (e) {
    //NOTE: Errorオブジェクトを新たに作成するとスタックトレースが失われ、stackを継承することはできない
    const error = e
    error.message = '[Modified] ' + error.message //プロパティの上書きだけならスタックトレースは維持される
    throw e
  }
}

async function sample() {
  return await new Promise((_, reject) =>
    setTimeout(() => {
      const sampleError = new Error('Sample Error')
      ;(reject(sampleError), 300)
    })
  )
}

handlingError()
