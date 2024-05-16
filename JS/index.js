const sectionVideo = document.querySelector('.video-message-container')
let select = document.querySelector('#select-device')
const validate = document.querySelector('#validate-btn')
const video = document.querySelector("#video");
const btnScreen = document.querySelector('#screen-btn')
const canvas = document.querySelector("#canvas-photo")
const btnSave = document.querySelector("#save-photo")
const link = document.querySelector('#link')
let image 

const constraints = {
  audio: false,
  video: true,
};



const optionGenerate= (device)=> {
    const option = document.createElement('option')
    option.classList.add("option")
    option.innerText = device.label
    option.value = device.groupId
    select.append(option)
}

const messageError=()=> {
    const div= document.createElement("div")
    div.classList.add("message-container")
    const p = document.createElement('p')
    p.classList.add("message")
    p.innerHTML= 'Media non autorisé :('
    div.append(p)
    sectionCanvcas.append(div)
}


const init=()=> {
    console.log('init');
    getAutorization()
    .then(()=> {
        getDevicesList()
    })
    .catch((error)=> {
        messageError()
    })

}


const getAutorization=()=> {
    return new Promise((resolve, reject)=> {
        navigator.mediaDevices.getUserMedia(constraints)
        .then((steam)=>{
            resolve(steam)
        })
        .catch((error)=> {
            reject(error)
        })
    });
}

const getDevicesList=()=> {
    navigator.mediaDevices.enumerateDevices()
    .then((devices) => {
        console.log(devices);
        devices.forEach((device) => {
            optionGenerate(device)
        })
    })
}



const takePhoto = () => {
    const ctx = canvas.getContext('2d')
    canvas.width= 480
    canvas.height=360
    ctx.drawImage(video, 0,0,480, 360)
    image = ctx.getImageData(0,0,480, 360)
    console.log(image.data);
    for(let i = 0; i <image.data.length; i+= 4){
        const r = image.data[i]
        const g = image.data[i+1]
        const b = image.data[i+2]
        const moyenne = Math.round((r + g + b) / 3)
     image.data[i] = image.data[i+1] = image.data[i+2] = moyenne
    }
   ctx.putImageData(image, 0, 0)
   image = ctx.getImageData(0,0,480, 360).data
   console.log("image en noir et blanc;", image);
}

const savePhoto = (e)=> {
    e.preventDefault()
    const dataUrl = canvas.toDataURL()
    console.log(dataUrl);
    link.download = "image.png"
    link.href = dataUrl 
    link.click()
}


validate.addEventListener('click',(e)=> {
    e.preventDefault();
    let inputSelect = select.value
    navigator.mediaDevices.getUserMedia({
        video: { 
            inputSelect: { exact: inputSelect },
            width: 480,
            height:360
        }
    })
    .then(steam =>{
        video.srcObject = steam
    })


})

init()

btnScreen.addEventListener("click", takePhoto)

btnSave.addEventListener('click', savePhoto)


