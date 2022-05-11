// 'use strict'
let profil;
let estSoumis = false;
let etat = "chargement";

const HTMLnumero = document.getElementById("numero");
const HTMLpoints = document.getElementById("points");
const HTMLtotal = document.getElementById("total");
const HTMLquestion = document.getElementById("question");
const HTMLchoix = document.getElementById("choix");
const HTMLminutes = document.getElementById("minutes");
const HTMLsecondes = document.getElementById("secondes");

// $(function () {
//     $(".contenu").hide()
//     $(".titre").on("click", function () {
//         $(".contenu").hide(1000)
//         $(this).next().show(1000)
//     })
// })
// $(function () {
//     $(".contenu").hide();
//     $(".titre").click;
//     $(".titre").on("click", function () {
//         $(".contenu").hide(1000);
       
//         $( ".inner" ).after( "<p>Test</p>" );
//         $( "<p>Test</p>" ).insertAfter( ".inner" );
       
//         $(this).parent().find(".contenu").show(1000);
//         $(this).append(`<p>PHILIPPE</p>`);
        
//     });
// });

// clearMessage();

jQuery(function() {
    clearMessage();
    changeEtat("formulaire");
});

function changeEtat(nom) {

    etat = nom; 

    // Affichage du form
    $('form').each(function() {
        $(this).removeClass('show');
    });
    $('#'+nom).addClass('show');

    // addMessage(`${etat}`);

    switch (etat) {
        case "formulaire":
            lancerFormulaire();
            break;
        case "quiz":
            lancerQuiz();
            break;
        case "sommaire":
            lancerSommaire();
            break; 
    }
}

function lancerFormulaire() {
    $("#formulaire").validate(
        {
            rules:{
                prenom:{
                    required:true,
                    maxlength: 32,
                    alphanumeric:true
                },
                nom:{
                    required:true,
                    maxlength: 32,
                    alphanumeric:true
                },
                date:{
                    required:true,
                    datePlusPetite: true
                },
                occupation:{
                    required:true
                }
            },
            messages:{
                prenom:{
                    required:"Le prénom est obligatoire",
                    maxlength : "Le prénpm ne peut pas être plus long que..."
                },
                nom:{
                    required:"Le prénom est obligatoire",
                    maxlength : "Le prénpm ne peut pas être plus long que..."
                },
                date:{
                    required:"Le date est requise"
                },
                occupation:{
                    required:"L'occupation est requise"
                }
            },
            submitHandler: function (form) {
                profil = {
                    "nom" : nom.value,
                    "prenom" : prenom.value,
                    "date" : date.value,
                    "occupation" : occupation.value
                };
                changeEtat("quiz");
            }, 
            showErrors: function (errorMap, errorList) {
                clearMessage();
                $.each(errorList, function () {
                    addMessage(`${this.message}`);
                });
                estSoumis = false;
                this.defaultShowErrors();
            },
            invalidHandler: function (form, validator) {
                estSoumis = true;
            },
        }
    );    

    // https://www.pierrefay.fr/blog/jquery-validate-formulaire-validation-tutoriel.html
    jQuery.validator.addMethod(
        "alphanumeric",
        function (value, element) {
        return this.optional(element) || /^[\w.]+$/i.test(value);
        },
        "Lettres, nombres, et soulignés seulement"
    );

    $.validator.addMethod(
        "datePlusPetite",
        function (value, element) {
        const dateActuelle = new Date();
        return this.optional(element) || dateActuelle >= new Date(value);
        },
        "La date de naissance doit être inférieure à la date d'aujourd'hui"
    );
}

function lancerQuiz() {
    // addMessage(`Bonjour ${JSON.stringify(profil)}`);
    startQuiz();   
}

function lancerSommaire() {
    // sommaire();    
}

function clearMessage() {
    const ul = $("<ul></ul>");
    $("#afficherErreurs").html(ul);
}

function addMessage(message) {
    $("#afficherErreurs").children('ul').append(`<li>${message}</li>`)
}

var points = 0;
var numero = 0;
var total = 0; 
var temps = 0; // temps en secondes

var horloge;

var clickable = true;
var quiz = true;

function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function updateClock() {
    HTMLminutes.innerHTML = Math.floor(temps/60);
    HTMLsecondes.innerHTML = pad(temps % 60,2);
}

function startQuiz() {
    quiz = true;
    numero = -1;
    points = 0;
    total = data.length;
    temps = 600;
    updateClock();
    horloge = setInterval(()=> {
        temps--;
        updateClock();
        if (temps == 0) {
            quiz = false;
            clickable = false;
            stopClock();
            alert("Temps Écoulé");
        }
    }, 1000);
    HTMLtotal.innerHTML = total;
    loadNextQuestion();
}


function stopClock() {
    clearInterval(horloge);
}

function loadNextQuestion() {
    numero++;
    if (numero<total) {
        HTMLnumero.innerHTML = (numero+1)+".";
        HTMLpoints.innerHTML = points;
        HTMLquestion.innerHTML = data[numero].question;

        let choix = data[numero].choix;
        let reponse = data[numero].reponse;

        HTMLchoix.innerHTML = "";

        let i;
        for (i=0;i<choix.length;i++) {
            let div = document.createElement("div");
            div.id = "choix"+(i+1);
            div.innerHTML = choix[i];
            div.classList.add("choix");
            div.classList.add("light");
            if (reponse == i+1) {    
                div.addEventListener("click", (e) => {
                    if (clickable && quiz)
                    {
                        e.currentTarget.classList.add("good");
                        removeLightsEffect();                        
                        points++;
                        HTMLpoints.innerHTML = points;
                        clickable = false;
                    } else {
                        if (quiz) loadNextQuestion();
                    }
                });
            } else {
                div.addEventListener("click", (e) => {
                    if (clickable && quiz)
                    {
                        e.currentTarget.classList.add("bad");
                        reveal();
                        clickable = false;
                    } else {
                        if (quiz) loadNextQuestion();
                    }
                });
            }
            HTMLchoix.appendChild(div);
        }

        clickable = true;
    } else {
        stopClock();
        alert("Quiz Terminé");
    }
}

function removeLightsEffect() {
    let i;
    let choix;
    for (i=0;i<data[numero].choix.length;i++) {
        choix = document.getElementById("choix"+(i+1));
        choix.classList.remove("light");
    }
}

function reveal() {
    let bonChoix = document.getElementById("choix"+(data[numero].reponse));
    bonChoix.classList.add("good");
    removeLightsEffect();
}


  var data = [
    {
        "question":"Vrai ou faux ? La phase de conception permet de spécifier dans les grandes lignes comment l'application Web doit se comporter tel que perçu par l'utilisateur",
        "choix": [
            "Vrai",
            "Faux"
        ],
        "reponse": 1
    },
    {
        "question":"Que signifie « modéliser » un logiciel",
        "choix":[
            "Réalisation des tests de validation d’un logiciel",
            "Représentation à l’aide de différents diagrammes",
            "Écriture de l’algorithme d’un logiciel",
            "Modification d’un logiciel existant",
            "Toutes ces réponses"],
        "reponse": 2
    },
    {
        "question":"Qu'est ce que le contexte d'un système ou logiciel",
        "choix": ["Les systèmes en relation avec le système","Les relations du logiciel","C’est l’environnement direct du logiciel","Les cas d'utilisation du système","Aucune de ces réponses"],
        "reponse": 3
    },
    {
        "question":"Quel est la relation entre deux cas d'utilisation qui indique que le second cas d'utilisation est toujours exécuté",
        "choix": [
            "Exclude",
            "Include",
            "Extend",
            "Association",
            "Aucune de ces réponses"
        ],
        "reponse": 2
    },
    {
        "question":"Qui suis-je ? Je suis considéré comme un référentiel partagé par un prestataire de service et l’équipe interne.",
        "choix": [
            "Cahier de production",
            "Diagramme de cas d'utilisation",
            "UML",
            "Cahier des charges",
            "Aucune de ces réponses"
        ],
        "reponse": 4
    },
    {
        "question":"Qui suis-je ? Une collection d’activité pour produire un résultat pour un client ou un marché.",
        "choix":[
            "Un cas d'utilisation",
            "Diagramme de classe",
            "Business Process Modeling Notation",
            "Processus métier",
            "Aucune de ces réponses"
        ],
        "reponse": 4
    },
    {
        "question":"Qu'est ce que UML",
        "choix": [
            "Un langage de modélisation",
            "Un langage de développement objet",
            "Une démarche de définition de logiciel",
            "Une méthode de gestion de projet",
            "Aucune de ces réponses"
        ],
        "reponse": 1
    },
    {
        "question" : "De combien de diagrammes se compose UML",
        "choix" : [
            "4 + 1 diagrammes",
            "9 diagrammes",
            "Une vingtaine de diagrammes",
            "14 diagrammes",
            "Aucune des ces réponses"
        ],
        "reponse" : 4
    },
  
];

$( function() {
    $( "#accordion" ).accordion();
    

  } );
  $( function() {
    $( "#progressbar" ).progressbar({
      value: 10
    });
  } );
 