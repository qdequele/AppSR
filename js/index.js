/*
Fichier Javascript
 */

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        setTimeout(function() {
            navigator.splashscreen.hide();
        }, 3000);
    },
    
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
        
        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
        
        console.log('Received Event: ' + id);
    }
};

/*function AdapterDivAResolution() {
    //var x_res = screen.width;
    var y_res = screen.height;

    if(y_res > 0)
    {
        alert("yees");
        //document.getElementByClassName("rectangle_p1").style.height =5000+'px';
        document.getElementByClassName("rectangle_p1").style.color=green;

    }
}*/



/********************************************/
/*********Function simuDistanceGtps()********/
/* Calcul le gain de temps entre 2 parcours */
/* Verifie les valeurs saisies par l'uti    */
/* Evolution : economie d'essence           */
/********************************************/



function simuDistanceGtps(){
    var distance;
    var vitesseActuelle;
    var vitesseAutorisee;
    var gainTps, gainTpsH, gainTpsMin;
    var erreur = 0;
    
    /*Récupération des données utilisateur*/
    distance         = document.getElementById('distanceSimuGtps').value;
    vitesseActuelle  = document.getElementById('vitesseActuelleSimuGtps').value;
    vitesseAutorisee = document.getElementById('vitesseAutoriseeSimuGtps').value;
    
    //Si l'utilisateur entre d'autres caractères que des chiffres
    var expReg = /^[0-9]*$/;//expression reguliere, verifie si l'utilisateur n'entre que des chiffres
    if((expReg.test(distance)==false)||(expReg.test(vitesseActuelle)==false)||(expReg.test(vitesseAutorisee)==false)){
        alert("Utilisez seulement les chiffres digitaux pour remplir les champs demandés");
        document.getElementById('gainTps').innerHTML="";
        erreur=1;
    }
    
    if(distance>2000){
        alert('Veuillez entrer une distance inférieure');
        document.getElementById('gainTps').innerHTML="";
        erreur=1;
    }
    
    if(vitesseActuelle>180){//si l'utilisateur entre une vitese trop grande
        alert('Veuillez entrer une vitesse inférieure');
        document.getElementById('gainTps').innerHTML="";
        erreur=1;
    }
    
    if(vitesseAutorisee>180){
        alert('Vitesse maximum : 130 km/h');
        document.getElementById('gainTps').innerHTML="";
        erreur=1;
    }
    
    
    if(erreur==0){//si tous les champs ont été remplis correctement
        /*Calcul du gain de temps*/
        gainTps = distance*(parseFloat(vitesseActuelle)-parseFloat(vitesseAutorisee))/(parseFloat(vitesseActuelle)*parseFloat(vitesseAutorisee));
        
        /*Convertion heure décimale/heure format H min*/
        gainTps=gainTps+"";//converti la durée en chaine de caractère
        
        //Heure
        var i=0;//compteur
        for(i=0;(gainTpsH!='.')&&(i<10);i++){//tant qu'on a pas trouve la virgule
            gainTpsH=gainTps.substring(i,(i+1));//l'heure correspond a l'ensemble des chiffres placés jusqu'à la virgule
        }
        gainTpsH=gainTps.substring(0, i-1);//on recupere l'ensemble des chiffres places AVANT la virgule
        
        //Minute
        gainTpsMin=(gainTps-gainTpsH).toFixed(2);//recupere les minutes en decimal et arrondi à la minute
        gainTpsMin=Math.round(gainTpsMin*60);//converti les minutes decimales en minutes sous format Heure/min + arrondi à la minute
        
        /*Gestion de l'affichage*/
        if(gainTpsH==0){
            document.getElementById('gainTps').innerHTML="Gain de temps : "+gainTpsMin+" Min";
        }
        
        if((gainTpsH==0)&&(gainTpsMin<0)){
            document.getElementById('gainTps').innerHTML="Perte de temps : "+gainTpsMin*(-1)+" Min";//ne pas afficher d'heure negative
        }
        
        if((gainTpsMin<0)&&(gainTpsH<0)){
            document.getElementById('gainTps').innerHTML="Perte de temps : "+gainTpsH*(-1)+" H "+gainTpsMin*(-1)+" Min";//ne pas afficher d'heure negative
        }
        
        if((gainTpsMin>0)&&(gainTpsH>0)){
            document.getElementById('gainTps').innerHTML="Gain de temps : "+gainTpsH+" H "+gainTpsMin+" Min";
        }
        
    }
}


function simuDistanceArret(){
    var vitessekm;
    var vitessems;
    var dtr;//distance de reaction
    var df;//distance de freinage
    var da;//distance d'arret
    var etat;//etat du conducteur
    var chausse;//etat de la chaussée
    var erreur = 0;
    
    if(formWeather.btnRadio[1].checked){
        chausse=formWeather.btnRadio[1].value;
        alert(chausse);
    }
    
    if(formWeather.btnRadio[0].checked){
        chausse=formWeather.btnRadio[0].value;
        alert(chausse);
    }
    
    /*Temps de réaction en fontion de l'état de l'utilisateur*/
    var etat =document.getElementById('etatSimuDA').value;
    
    switch(etat){
        case 'N'://normal
            etat=1;//seconde de reaction
            break;
        case 'F'://fatigue
            etat=2;
            break;
        case 'A'://alccolisé
            etat=3;
            break;
    }
    
    /*Vitesse*/
    vitessekm = document.getElementById('vitesseSimuArret').value;//recupere la vitesse en km/H
    
    //Si l'utilisateur entre d'autres caractères que des chiffres
    var expReg = /^[0-9]*$/;//expression reguliere, verifie si l'utilisateur n'entre que des chiffres
    if((expReg.test(vitessekm)==false)){
        alert("Utilisez seulement les chiffres digitaux pour remplir les champs demandés");
        erreur=1;
    }
    
    if(vitessekm>300){//si l'utilisateur entre une vitese trop grande
        alert('Veuillez entrer une vitesse inférieure à celle indiquée');
        document.getElementById('distReaction').innerHTML="";
        document.getElementById('distFreinage').innerHTML="";
        document.getElementById('distArret').innerHTML="";
        
        erreur=1;
    }
    
    //Calcul des différentes distances
    if(erreur==0){//si la vitesse est probable
        vitessem = (vitessekm*1000);//passe la vitesse en metres
        
        /*Distance de réaction*/
        dtr=(vitessem*etat/3600).toFixed(2);//calcul la distance de reaction
        document.getElementById('distReaction').innerHTML="Distance de réaction : "+dtr+" mètres";
        
        
        /*Distance de freinage*/
        //chausse = document.getElementById('chausseSimuDA').value;
        
        switch(chausse){
            case 'S'://seche
                df = ((Math.pow((vitessem/3600),2)/14)).toFixed(2);//math.pow : élevé à la puissance
                break;
            case 'M' ://mouillée
                df = ((Math.pow((vitessem/3600),2)/7)).toFixed(2);
                
        }
        document.getElementById('distFreinage').innerHTML="Distance de freinage : "+df+" mètres";
        
        
        /*Distance d'arret*/
        da = (parseFloat(dtr) + parseFloat(df)).toFixed(2);//empeche la concatenation des nombres
        document.getElementById('distArret').innerHTML="Distance d'arret : "+da+" mètres";
    }
    
    /*Importation d'un speedometer*/
    $('#graphSimuArret').highcharts({
        
        chart: {
            type: 'gauge',
            plotBackgroundColor: null,
            plotBackgroundImage: null,
            plotBorderWidth: 0,
            plotShadow: false
        },
        
        title: {
            text: 'Speedometer',
            style: {
                display: 'none'//ne pas afficher de titre
            }
        },
        
        pane: {
            startAngle: -150,
            endAngle: 150,
            background: [{
                backgroundColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, '#FFF'],
                        [1, '#333']
                    ]
                },
                borderWidth: 0,
                outerRadius: '109%'
            }, {
                backgroundColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, '#333'],
                        [1, '#FFF']
                    ]
                },
                borderWidth: 1,
                outerRadius: '107%'
            }, {
                // default background
            }, {
                backgroundColor: '#DDD',
                borderWidth: 0,
                outerRadius: '105%',
                innerRadius: '103%'
            }]
        },
        
        // the value axis
        yAxis: {
            min: 0,
            max: 300,
            
            minorTickInterval: 'auto',
            minorTickWidth: 1,
            minorTickLength: 10,
            minorTickPosition: 'inside',
            minorTickColor: '#666',
            
            /*tick : vitesse "ronde"*/
            tickPixelInterval: 30,
            tickWidth: 2,
            tickPosition: 'inside',
            tickLength: 10,
            tickColor: '#666',
            labels: {
                step: 2,
                rotation: 'auto'
            },
            title: {
                text: 'km/h'
            },
            plotBands: [{
                from: 0,
                to: 120,
                color: '#55BF3B' // green
            }, {
                from: 120,
                to: 160,
                color: '#DDDF0D' // yellow
            }, {
                from: 160,
                to: 300,
                color: '#DF5353' // red
            }]        
        },
        
        credits: {
            enabled: false //desactive la pub de HighChart.com
            
        },  
        
        exporting: {
            enabled: false //desactive le bouton de sauvegarde de graph
        },
        
        series: [{
            name: 'Vitesse',
            data: [+vitessekm],//affecte la vitesse passée par l'utilisateur
            tooltip: {
                valueSuffix: ' km/h'
            }
        }]
        
        
    }, 
                                    
                                    // Add some life
                                    function (chart) {
                                        
                                        if (!chart.renderer.forExport) {
                                            
                                            setInterval(function () {//declanche une opération a intervals reguliers
                                                var point = chart.series[0].points[0],
                                                    newVitesse,
                                                    //inc = Math.round((Math.random() - 0.5) * 20);
                                                    inc = 1;
                                                
                                                newVitesse = point.y ;
                                                
                                                if(newVitesse-inc>=0){
                                                    newVitesse = newVitesse - inc;
                                                }
                                                
                                                point.update(newVitesse);//mettre a jour la vitesse
                                                
                                            }, 150);//delai d'appel a la fonction
                                            
                                        }//fin if
                                        
                                    });//fin fonction modifications de vitesse
    
}

/********************************************/
/***********Fonction simuTauxAlcool**********/
/************Liste alcool : J-SON************/
/*********Calcul le taux d'alcool g/l********/
/********Calcul le temps d'élimination*******/
/**Représentation graphique du taux d'alcool*/
/********************************************/


function simuTauxAlcool(){
    /*Definition des boissons--JSON*/
    var boissonDetail = {
        "biere": 
        {
            "degre":0.05,
            "contenance":250,
        },
        
        "champagne":
        {
            "degre":0.12,
            "contenance":100,
        },
        
        "cidre":
        {
            "degre":0.05,
            "contenance":250,
        },
        
        "digestif":
        {
            "degre":0.45,
            "contenance":25,
        },
        
        "passoa":
        {
            "degre":0.2,
            "contenance":0,
        },
        
        "pastis":
        {
            "degre":0.45,
            "contenance":25,
        },
        
        "porto":
        {
            "degre":0.2,
            "contenance":60,
        },
        
        "premix gloss":
        {
            "degre":0.15,
            "contenance":0,
        },
        
        "premix sminorff":
        {
            "degre":0.056,
            "contenance":0,
        },
        
        "rhum":
        {
            "degre":0.4,
            "contenance":30,
        },
        
        "tequila":
        {
            "degre":0.38,
            "contenance":30,
        },
        
        "vin":
        {
            "degre":0.12,
            "contenance":100,
        },
        
        "vodka":
        {
            "degre":0.375,
            "contenance":40,
        },
        
        "whisky":
        {
            "degre":0.45,
            "contenance":30,
        },
        
        
        
    };
    console.log(boissonDetail);//test firebug
    
    
    /*****Variables*****/
    //Récupération des données entrées par l'utilisateur
    //var genre   =document.getElementById('genreSimuTA').value;
    var genre;
    var poids   =document.getElementById('poids').value;
    //var qt      =document.getElementById('qtSimuTA').value;
    var boisson =document.getElementById('boisson').value;
    var nbVerres=document.getElementById('nbVerres').value;
    
    var coeffDiffusion;
    var tauxAlcool;//defini le taux d'alcool dans le sang en g/l
    var degreBoisson;
    var dureeEliminationD;//decimal
    var dureeEliminationH;//sous le format heure decimale
    var dureeEliminationHeure;//format heure H
    var erreur=0;//variable verifie si erreur lors de la saisie
    
    //Homme ou Femme bouton radio
    if(formHF.btnRadio[1].checked){
        genre=formHF.btnRadio[1].value;
        alert(genre);
    }
    
    if(formHF.btnRadio[0].checked){
        genre=formHF.btnRadio[0].value;
        alert(genre);
    }
    /*Vérification du remplissage des champs*/
    
    //Si un des champs reste vide
    if((poids=="")||(nbVerres=="")){
        alert("Veuillez remplir les champs indiqués");
        document.getElementById('reponse').innerHTML="";
        erreur=1;
    }
    
    //Si l'utilisateur entre d'autres caractères que des chiffres
    var expReg = /^[0-9]*$/;//expression reguliere, verifie si l'utilisateur n'entre que des chiffres
    if((expReg.test(poids)==false)||(expReg.test(nbVerres)==false)){
        alert("Utilisez seulement les chiffres digitaux pour remplir les champs demandés");
        document.getElementById('reponse').innerHTML="";
        erreur=1;
    }
    
    //Si l'utilisateur rempli un nombre improbable de verres
    if(nbVerres>70){
        alert('Veuillez saisir un nombre inférieur de verres consommés');
        document.getElementById('reponse').innerHTML="";
        erreur=1;
    }
    
    
    /*Attribution du coefficient de diffusion de l'alcool selon le sexe de l'utilisateur*/
    if(genre=='H'){//si c'est un homme
        coeffDiffusion=0.7;
    }
    else{//si c'est une femme
        coeffDiffusion=0.6;
    }
    
    if(boisson=='autre'){
        
        //Fonction temporaire --> SQL Lite
        alert("Autre !");
        var degB=prompt('Autre boisson : \nDegré en %');
        var contB=prompt('Autre boisson : \n Volume en mL');
        degB=degB/100;
        alert(degB);/*
        $("#dialogAutreB").dialog({
            modal: true,
            buttons:{
                "Calculer": boite(){
                    $(this).dialog("close");
                }
            }
        });*/
        
    }
    
    /*Calcul de taux d'alcool dans le sang*/
    if(erreur!=1){//si les champs sont remplis correctement
        //console.log('Simu alcool ok');
        
        switch(boisson){//selon la boisson que l'utilisateur a choisi dans la liste déroulante
            case 'biere':
                tauxAlcool=(boissonDetail.biere.contenance*(boissonDetail.biere.degre)*0.8*nbVerres)/(coeffDiffusion*poids);
                break;
            case 'champagne':
                tauxAlcool=(boissonDetail.champagne.contenance*(boissonDetail.champagne.degre)*0.8*nbVerres)/(coeffDiffusion*poids);
                break;
            case 'cidre':
                tauxAlcool=(boissonDetail.cidre.contenance*(boissonDetail.cidre.degre)*0.8*nbVerres)/(coeffDiffusion*poids);
                break;
            case 'digestif':
                tauxAlcool=(boissonDetail.digestif.contenance*(boissonDetail.digestif.degre)*0.8*nbVerres)/(coeffDiffusion*poids);
                break;
            case 'pastis':
                tauxAlcool=(boissonDetail.pastis.contenance*(boissonDetail.pastis.degre)*0.8*nbVerres)/(coeffDiffusion*poids);
                break;
            case 'porto':
                tauxAlcool=(boissonDetail.porto.contenance*(boissonDetail.porto.degre)*0.8*nbVerres)/(coeffDiffusion*poids);
                break;
            case 'rhum':
                tauxAlcool=(boissonDetail.rhum.contenance*(boissonDetail.rhum.degre)*0.8*nbVerres)/(coeffDiffusion*poids);
                break;
            case 'vin':
                tauxAlcool=(boissonDetail.vin.contenance*(boissonDetail.vin.degre)*0.8*nbVerres)/(coeffDiffusion*poids);
                break;
            case 'vodka':
                tauxAlcool=(boissonDetail.vodka.contenance*(boissonDetail.vodka.degre)*0.8*nbVerres)/(coeffDiffusion*poids);
                break;
            case 'whisky':
                tauxAlcool=(boissonDetail.whisky.contenance*(boissonDetail.whisky.degre)*0.8*nbVerres)/(coeffDiffusion*poids);
                break;
            case 'autre':
                tauxAlcool=contB*degB*0.8*nbVerres/(coeffDiffusion*poids);
                break;
                //default : alert('Veuillez choisir une boisson');
        }
        
        if(tauxAlcool>=3){
            alert('Vous avez dépassé les limites acceptables pour votre santé');
            erreur=1;
        }
        
        if(erreur!=1){
            /*Definition du temps d'élémination du taux d'alcool dans le sang*/
            dureeEliminationD=tauxAlcool/0.15;
            dureeEliminationH=dureeEliminationD+"";//converti la durée en chaine de caractère
            
            //Heure
            var i=0;//compteur
            for(i=0;(dureeEliminationHeure!='.')&&(i<10);i++){//tant qu'on a pas trouve la virgule
                dureeEliminationHeure=dureeEliminationH.substring(i,(i+1));//l'heure correspond a l'ensemble des chiffres placés jusqu'à la virgule
            }
            dureeEliminationHeure=dureeEliminationH.substring(0, i-1);//on recupere l'ensemble des chiffres places AVANT la virgule
            
            //Minute
            dureeEliminationMinD=(dureeEliminationH-dureeEliminationHeure).toFixed(2);//recupere les minutes en decimal et arrondi à la minute
            dureeEliminationMin=Math.round(dureeEliminationMinD*60);//converti les minutes decimales en minutes sous format Heure/min + arrondi à la minute
            
            if(dureeEliminationHeure==0){//si le temps d'élimination est inférieur a une heure
                document.getElementById('reponse').innerHTML="Votre taux d'alcoolémie est de "+tauxAlcool.toFixed(2)+"g/l. Temps d'élimination : "+dureeEliminationMin+"min";
            }
            
            if(dureeEliminationHeure!=0){
                document.getElementById('reponse').innerHTML="Votre taux d'alcoolémie est de "+tauxAlcool.toFixed(2)+"g/l. Temps d'élimination : "+dureeEliminationHeure+"H "+dureeEliminationMin+"min";
            }
            
            
            /*Représentation graphique du temps d'élimination*/
            $('#graphAlcool').highcharts({
                title: {
                    text: 'Taux d\'alcoolémie en fonction du temps',
                    x: -20 //center
                },/*
                subtitle: {
                    text: 'Source: WorldClimate.com',
                    x: -20
                },*/
                xAxis: {
                    
                    categories: ['1', '2', '3', '4', '5', '6',
                                 '7', '8', '9', '10', '11', '12']
                    
                    /*
                    categories: (function(){
                        //var cptCat = 0,
                        var categories=[],
                            time = (new Date()).getTime(),
                            cptCat;
                        for(cptCat=0; cptCat<=dureeEliminationHeure+1; cptCat++){
                            categories.push({
                                x : 10,
                            });
                        }
                        return categories;
                    }),
                    */
                    
                },
                yAxis: {
                    title: {
                        text: 'Taux d\'alcool en g/L'
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },
                xAxis: {
                    title: {
                        text: 'Temps en heure'
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },/*
                tooltip: {
                    valueSuffix: '°C'
                },*/
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle',
                    borderWidth: 0
                },
                series: [{
                    name: 'Votre taux',
                    data: [tauxAlcool.toFixed(2)-0.0, tauxAlcool.toFixed(2)-0.15, tauxAlcool.toFixed(2)-0.3, tauxAlcool.toFixed(2)-0.45, tauxAlcool.toFixed(2)-0.6, tauxAlcool.toFixed(2)-0.75, tauxAlcool.toFixed(2)-0.9]
                }/*, {
                    name: 'New York',
                    data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
                },*/],
                credits: {
                    enabled: false //desactive la pub de HighChart.com
                },
                exporting: {
                    enabled: false //desactive le bouton de sauvegarde de graph
                },
            });
        }//fin du if verification de non erreur
        
    }//fin if erreur
}//fin function simuTauxAlcool



/***Swipe***/
// Pagecreate will fire for each of the pages in this demo
// but we only need to bind once so we use "one()"
$( document ).one( "pagecreate", ".demo-page", function() {
    // Initialize the external persistent header and footer
    $( "#header" ).toolbar({ theme: "b" });
    $( "#footer" ).toolbar({ theme: "b" });
    
    // Handler for navigating to the next page
    function navnext( next ) {
        $( ":mobile-pagecontainer" ).pagecontainer( "change", next + ".html", {
            transition: "slide"
        });
    }
    
    // Handler for navigating to the previous page
    function navprev( prev ) {
        $( ":mobile-pagecontainer" ).pagecontainer( "change", prev + ".html", {
            transition: "slide",
            reverse: true
        });
    }
    
    // Navigate to the next page on swipeleft
    $( document ).on( "swipeleft", ".ui-page", function( event ) {
        // Get the filename of the next page. We stored that in the data-next
        // attribute in the original markup.
        var next = $( this ).jqmData( "next" );
        
        // Check if there is a next page and
        // swipes may also happen when the user highlights text, so ignore those.
        // We're only interested in swipes on the page.
        if ( next && ( event.target === $( this )[ 0 ] ) ) {
            navnext( next );
        }
    });
    
    // The same for the navigating to the previous page
    $( document ).on( "swiperight", ".ui-page", function( event ) {
        var prev = $( this ).jqmData( "prev" );
        
        if ( prev && ( event.target === $( this )[ 0 ] ) ) {
            navprev( prev );
        }
    });
});//Fin function Swipe


/*Local Storage*/
//Fonction a appeler si la base est vide = premiere utilisation du simu (ne doit pas etre rappeler a chaque fois)
function baseBoissons(){
    
    var boissonDetail = {
        "Biere": 
        {
            "degre":0.05,
            "contenance":250,
        },
        
        "Champagne":
        {
            "degre":0.12,
            "contenance":100,
        },
        
        "Cidre":
        {
            "degre":0.05,
            "contenance":250,
        },
    };
    
    var boissonDefautStock = JSON.stringify(boissonDetail);//conversion a format J-SON
    
    window.localStorage.setItem('Boisson', boissonDefautStock);//stock les objets J-SON
    
    var leStock = window.localStorage.getItem('Boisson');//retourne l'objet J-SON
    
    var listeBoissons = JSON.parse(leStock);//inverse de stringify
    
    $.each(listeBoissons, function(key, value){
        //console.log(key + ' = ' + value);
        var listeActuelle = $("#listeAlcools").html();//récupère le contenu actuel de la liste d'alcools
        document.getElementById('listeAlcools').innerHTML=listeActuelle + "<li><a class=\"ui-btn ui-btn-icon-right ui-icon-carat-r\" href=\"index.html\">"+key+"</a></li>";
    });
    
}//fin function baseBoissons()

function ajoutBoisson(){
    alert('lol');
}

function ajoutVerres(){
    
}