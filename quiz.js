var JSONdata = `
    {
        "questionnaire" : [
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
        } 
    ]
}`;

var self;
var callback;

class Quiz {
    constructor (progressbar,pointage,total,no,question,choix) 
    {
        this.HTMLprogressbar = progressbar;
        this.HTMLpointage = pointage;
        this.HTMLtotal = total;
        this.HTMLnumero = no;
        this.HTMLquestion = question;
        this.HTMLchoix = choix;
        self = this;
    }
    startQuiz(callBack) {
        callback = callBack;
        this.numero = -1;
        this.points = 0;
        this.tentative = JSON.parse(JSONdata);
        this.total = this.tentative.questionnaire.length;
        this.HTMLtotal.text(this.total);
        this.updatePointage();
        this.loadNextQuestion();
        this.HTMLprogressbar.delay(2000).fadeIn(2000);
    }
    updateProgressBar() {
        this.HTMLprogressbar.progressbar({"value":this.numero,"max":this.total});
        // .addClass('show');
    }
    updatePointage() {
        this.HTMLpointage.text(this.points);
    }
    animationQuestion() {
        $('#quiz').slideUp(1000).delay(500).slideDown(1000);
        setTimeout(function () {self.loadNextQuestion();},1000);
    }
    loadNextQuestion() {
        this.numero++;
        this.updateProgressBar();
        if (this.numero<this.total) {
            this.HTMLnumero.text((this.numero+1)+".");
            this.HTMLquestion.text(this.tentative.questionnaire[this.numero].question);
    
            let choix = this.tentative.questionnaire[this.numero].choix;
            let reponse = this.tentative.questionnaire[this.numero].reponse;
    
            this.HTMLchoix.html("");
    
            let i;
            for (i=0;i<choix.length;i++) {
                let div = $(`<div class="choix light" id="${i+1}">${choix[i]}</div>`);
                if (reponse == i+1) {    
                    div.on('click',this.bonChoix);
                } else {
                    div.on('click',this.mauvaisChoix);
                }
                this.HTMLchoix.append(div);
            }
            this.clickable = true;
        } else {
            // alert("FIN DU QUIZ");
            callback();
        }
    }
    bonChoix(e){
        if (self.clickable)
        {
            e.currentTarget.classList.add("good");
            self.removeLightsEffect();                        
            self.points++;
            self.updatePointage();
            self.clickable = false;
            self.tentative.questionnaire[self.numero].reponseChoisie = parseInt(e.target.id);
        } else {
            self.animationQuestion();
        }
    }
    mauvaisChoix(e) {
        if(self.clickable) {
            e.currentTarget.classList.add("bad");
            self.reveal();
            self.clickable = false;
            self.tentative.questionnaire[self.numero].reponseChoisie = parseInt(e.target.id);
        } else {
            self.animationQuestion();
        }
    }

    removeLightsEffect() {
        let i;
        let choix;
        for (i=0;i<this.tentative.questionnaire[this.numero].choix.length;i++) {
            $(`#${i+1}`).removeClass("light");
        }
    }
    reveal() {
        $(`#${this.tentative.questionnaire[this.numero].reponse}`).addClass("good");
        this.removeLightsEffect();
    }
}


    
// }

// function pad(n, width, z) {
//     z = z || '0';
//     n = n + '';
//     return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
// }

