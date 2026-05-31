const componentes = [];

const cables = [];

let contador = 0;

/* =========================
   TERMICA
========================= */

componentes.push({

    id:"termica",

    type:"termica",

    state:true,

    fija:true,

    x:40,

    y:220,

    w:90,

    h:180,

    bornes:[

        {
            id:"fase",
            x:25,
            y:150,
            color:"red"
        },

        {
            id:"neutro",
            x:65,
            y:150,
            color:"blue"
        }
    ]
});

/* =========================
   DISYUNTOR
========================= */

componentes.push({

    id:"disyuntor",

    type:"disyuntor",

    state:true,

    fija:true,

    x:150,

    y:220,

    w:90,

    h:180,

    bornes:[

        {
            id:"fase",
            x:25,
            y:150,
            color:"red"
        },

        {
            id:"neutro",
            x:65,
            y:150,
            color:"blue"
        }
    ]
});

/* =========================
   CREAR COMPONENTE
========================= */

function crearComponente(tipo){

    contador++;

    let comp = {

        id:
        tipo + contador,

        type:tipo,

        x:250,

        y:200,

        w:80,

        h:80,

        state:false,

        encendida:false,

        bornes:[]
    };

    /* =========================
       LAMPARA
    ========================= */

    if(tipo==="lampara"){

        comp.w=90;

        comp.h=70;

        comp.bornes=[

            {
                id:"fase",
                x:15,
                y:35,
                color:"orange"
            },

            {
                id:"neutro",
                x:75,
                y:35,
                color:"blue"
            }
        ];
    }

    /* =========================
       SIMPLE
    ========================= */

    else if(tipo==="simple"){

        comp.w=70;

        comp.h=120;

        comp.bornes=[

            {
                id:"in",
                x:35,
                y:20,
                color:"red"
            },

            {
                id:"out",
                x:35,
                y:100,
                color:"orange"
            }
        ];
    }

    /* =========================
       COMBINADA
    ========================= */

    else if(tipo==="combinada"){

        comp.w=80;

        comp.h=130;

        comp.bornes=[

            {
                id:"comun",
                x:40,
                y:20,
                color:"red"
            },

            {
                id:"via1",
                x:20,
                y:105,
                color:"orange"
            },

            {
                id:"via2",
                x:60,
                y:105,
                color:"yellow"
            }
        ];
    }

    /* =========================
       4 VIAS
    ========================= */

    else if(tipo==="cuatrovias"){

        comp.w=90;

        comp.h=140;

        comp.bornes=[

            {
                id:"e1",
                x:20,
                y:20,
                color:"yellow"
            },

            {
                id:"e2",
                x:70,
                y:20,
                color:"orange"
            },

            {
                id:"s1",
                x:20,
                y:120,
                color:"yellow"
            },

            {
                id:"s2",
                x:70,
                y:120,
                color:"orange"
            }
        ];
    }

    /* =========================
       PULSADOR
    ========================= */

    else if(tipo==="pulsador"){

        comp.w=70;

        comp.h=120;

        comp.bornes=[

            {
                id:"in",
                x:35,
                y:20,
                color:"red"
            },

            {
                id:"out",
                x:35,
                y:100,
                color:"orange"
            }
        ];
    }

    /* =========================
       PALIER
    ========================= */

    else if(tipo==="palier3"){

        comp.w=110;

        comp.h=140;

        comp.bornes=[

            {
                id:"fase",
                x:25,
                y:25,
                color:"red"
            },

            {
                id:"neutro",
                x:85,
                y:25,
                color:"blue"
            },

            {
                id:"puls",
                x:55,
                y:115,
                color:"orange"
            }
        ];
    }

    componentes.push(comp);
}

/* =========================
   TERMICA
========================= */

function togglePower(){

    let termica =
    componentes.find(
        c=>c.type==="termica"
    );

    if(!termica)
    return;

    termica.state =
    !termica.state;
}

/* =========================
   LIMPIAR
========================= */

function limpiarTablero(){

    for(
        let i=componentes.length-1;
        i>=0;
        i--
    ){

        if(
            !componentes[i].fija
        ){

            componentes.splice(i,1);
        }
    }

    cables.length = 0;
}