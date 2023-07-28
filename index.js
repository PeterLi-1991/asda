
async function init(){
    console.log(6666)
    model= await tf.loadLayersModel('https://github.com/PeterLi-1991/asda/blob/main/model.json');
    console.log('load model...');
}

let imgElement = document.getElementById('canvasInput');
let inputElement = document.getElementById('inputfile');
inputElement.addEventListener('change', (e) => {
    imgElement.src = URL.createObjectURL(e.target.files[0]);
    imgElement.width=144;
    imgElement.height=144;
}, false);

function submit(){
    const inputImage = imgElement.src;
    predict(inputImage);
}

function findMaxIndex(result){
    const arr = Array.from(result);
    let maxIndex=0;
    let maxValue=0;
    for(let i=0;i<arr.length;i++){
      if(arr[i]>maxValue){
        maxIndex=i;
        maxValue=arr[i]
      }
    }
    return {predNum: maxIndex, prob: maxValue};
  }

function predict(imgelement){
    // 將輸入照片轉換成轉換為矩陣
    const tfimage = tf.browser.fromPixels(imgElement, 3);
    // 強制將圖片縮小到 28*28 像素
    const resize_image = tf.image.resizeBilinear(tfimage, [32, 32]);
    // 將 tensor 設為浮點型態，且將張量攤平至一為矩陣。此時 shape 為 [1, 784]
    let resize_image_reshape = resize_image.reshape([1, 32, 32, 3]);
    // 將所有數值除以255
    resize_image_normalize=resize_image_reshape.div(tf.scalar(255));
    // 預測 
    const pred = model.predict(resize_image_normalize);
    const result = pred.dataSync();
    // 取得 one hot encoding 陣列中最大的索引
    const {predNum, prob} = findMaxIndex(result);
    const arr = Array.from(result);
    const predict_number = arr.indexOf(Math.max(...arr));
    //查使用argMax(1)
    //https://stackoverflow.com/questions/70706030/make-prediction-with-cnn-sign-language-model-tensorflowjs
    //console.log(predNum, prob);
    console.log(result);
    console.log(predict_number);
    var cata_list = ['飛機', '汽車','鳥','貓','鹿','狗','青蛙','馬','船','卡車'];
    var result2 = cata_list[predict_number];
    document.getElementById('predit_result').innerHTML=result2;

}
