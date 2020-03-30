window.onload = ()=>{
    var btReasearch = document.getElementById("research");
    function viewDati(){
        window.location.href = "dati.html";
    }
    btReasearch.addEventListener("click",viewDati); 
    animateInfo();

    function animateInfo(){
        var info = document.querySelectorAll("#info");

        for (let i = info.length - 1; i >= 0; i--) {

            setTimeout(() => {
                info[i].style.visibility = "visible";
                info[i].animate([{ transform: "translateX(-10%)", opacity: 0 }, { transform: "translateX(0%)", opacity: 1 }], 700);
            }, 800 - 300 * i);
        }
    }
}

