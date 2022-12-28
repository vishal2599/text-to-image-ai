document.getElementById('image-form').addEventListener('submit', onSubmit);

function onSubmit(e){
    e.preventDefault();

    const prompt = document.querySelector('#prompt').value;
    const size = document.querySelector('#size').value;
    const imgNum = document.querySelector('#images-number').value;
    
    
    if( prompt == '' ){
        alert('Please add some text');
        return;
    }
    
    generateImageRequest(prompt, size, imgNum);
}

async function generateImageRequest(prompt, size, n){
    try {
        addLoader();
        const response = await fetch('/openai/generateimage', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({prompt, size, n:parseInt(n) })
        });

        if( !response.ok ){
            removeLoader();

            throw new Error('That image could not be generated');
        }

        const data = await response.json();

        for(var i=0; i<data.data.length; i++){
             document.querySelector('.images-generated .images-wrap').insertAdjacentHTML("afterbegin", '<div class="img"><img src="'+data.data[i].url+'"></div>');
        }

        document.querySelector('.msg').textContent = "Images generated successfully";
        
        removeLoader();
        resetFormValues();

    } catch (error) {
        removeLoader();
        console.log(error);
        document.querySelector('.msg').textContent = error;
    }
}

function addLoader(){
    document.querySelector('.loader-wrap').classList.add('show');
    document.querySelector('body').classList.add('no-overflow');
}

function removeLoader(){
    document.querySelector('.loader-wrap').classList.remove('show');
    document.querySelector('body').classList.remove('no-overflow');
}

function resetFormValues(){
    document.querySelector('#prompt').value = '';
    document.querySelector('#size').value = '';
    document.querySelector('#images-number').value = '';
}