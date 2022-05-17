// 'use strict'
let profil = {
    "nom" : "Bienvenu",
    "prenom" : "Amy",
    "date" : "1975-06-18",
    "occupation" : "Étudiant"
};
let estSoumis = false;
let etat = "chargement";
let startingState = "formulaire";
let quiz;

jQuery(function() {
    clearMessage();
    changeEtat(startingState);
});

function changeEtat(nom) {

    if(etat!="chargement") 
    {
        $('#'+etat).fadeOut(1000);
        $('#'+nom).delay(1000).fadeIn(1000);
    }
    else
    {
        $('#'+nom).slideDown("slow");
    }

    etat = nom; 

    // Affichage du form
    // $('form').each(function() {
    //     $(this).removeClass('show');
    // });
    // $('#'+etat).addClass('show');
    // addMessage(`${etat}`);
    // .addClass('show');

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
                    maxlength : "Le prénom ne peut pas être plus long que..."
                },
                nom:{
                    required:"Le prénom est obligatoire",
                    maxlength : "Le prénom ne peut pas être plus long que..."
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
    quiz = new Quiz($('#progressbar'),$('#points'),$('#total'),$('#numero'),$('#question'),$('#choix')); 
    quiz.startQuiz(lancerModal);

}

function lancerModal() {
    $('#modal').addClass('show');
    changeEtat('sommaire');
    // lancer modal
}

function age(naissance) {
    naissance = new Date(naissance);
    var aujourdhui = new Date();
    return Math.floor((aujourdhui-naissance) / (365.25 * 24 * 60 * 60 * 1000));
}

function lancerSommaire() {
    // Remplir Écran Sommaire avec les informations reçues.
    remplirSommaireProfil();
    remplirSommaireAccordeon();
    remplirSommaireDatatable();
}

function clearMessage() {
    const ul = $("<ul></ul>");
    $("#afficherErreurs").html(ul);
}

function addMessage(message) {
    $("#afficherErreurs").children('ul').append(`<li>${message}</li>`)
}

function remplirSommaireProfil() {
    $('#sommaire1').append(`<p>Prénom : ${profil.prenom}</p>`)
    $('#sommaire1').append(`<p>Nom : ${profil.nom}</p>`)
    $('#sommaire1').append(`<p>Âge : ${age(profil.date)}</p>`)
    $('#sommaire1').append(`<p>Statut : ${profil.occupation}.e</p>`);
}

function remplirSommaireAccordeon() {
    for (i=0;i<quiz.total;i++) {
        $('#accordion').append(
            `<h3>Question ${i+1}</h3>
            <div>
            <p>${quiz.tentative.questionnaire[i].question}</p>
            <p>Vous avez répondu : ${quiz.tentative.questionnaire[i].choix[quiz.tentative.questionnaire[i].reponseChoisie-1]}</p>
            Choix de réponses:
            <ul><li>${quiz.tentative.questionnaire[i].choix.join('</li><li>')}</li></ul> 
            </div>
            `);
    }
    $("#accordion").accordion();

  

}
function remplirSommaireDatatable(){
    for(i=0;i<quiz.total;i++){
        let message = (quiz.tentative.questionnaire[i].reponse == quiz.tentative.questionnaire[i].reponseChoisie) ? "BON" : "MAUVAIS";
        $("#dataTable").append(
           `<tr>
           <td>${i+1}</td>
           <td>${quiz.tentative.questionnaire[i].question}</td>
           <td>${quiz.tentative.questionnaire[i].choix[quiz.tentative.questionnaire[i].reponseChoisie-1]}<br><i>${message}</i></td>
           </tr>
           ` 
           );
          
    }
    $(document).ready(function () {
        $('#dataTable').DataTable();
        $('.dataTables_length').addClass('bs-select');
        });
      
    
}

