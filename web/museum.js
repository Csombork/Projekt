const pages = document.querySelectorAll('.page');
const years = document.querySelectorAll('.timeline span');

let current = 0;

function showPage(index){

    pages.forEach(page=>{
        page.classList.remove('active');
        page.classList.add('hidden');
    });

    years.forEach(y=>y.classList.remove('active'));

    pages[index].classList.remove('hidden');
    pages[index].classList.add('active');

    years[index].classList.add('active');
}

showPage(current);

document.getElementById('down').onclick = ()=>{

    if(current < pages.length-1){
        current++;
        showPage(current);
    }

};

document.getElementById('up').onclick = ()=>{

    if(current > 0){
        current--;
        showPage(current);
    }

};

document.addEventListener('wheel',(e)=>{

    if(e.deltaY > 0){

        if(current < pages.length-1){
            current++;
            showPage(current);
        }

    }else{

        if(current > 0){
            current--;
            showPage(current);
        }

    }

});