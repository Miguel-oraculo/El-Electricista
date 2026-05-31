let timers = {};

function actualizarElectricidad(){

    /* =========================
       RESET
    ========================= */

    componentes.forEach(comp=>{

    if(comp.type==="lampara"){

        comp.encendida = false;
    }
    });

        

    cables.forEach(c=>{

        c.energizado = false;
    });

    cortoCircuito = false;

    /* =========================
       BUSCAR TERMICA
    ========================= */

    let termica =
    componentes.find(
        c=>c.type==="termica"
    );

    if(!termica) return;

    /* =========================
       BUSCAR DISYUNTOR
    ========================= */

    let disyuntor =
    componentes.find(
        c=>c.type==="disyuntor"
    );

    /* =========================
       TERMICA / DISYUNTOR OFF
    ========================= */

    if(
        !termica.state ||

        (
            disyuntor &&
            !disyuntor.state
        )
    ){
        return;
    }

    /* =========================
       CREAR GRAFO
    ========================= */

    let conexiones = {};

    componentes.forEach(comp=>{

        comp.bornes.forEach(b=>{

            conexiones[
                comp.id + "_" + b.id
            ] = [];
        });
    });

    /* =========================
       CABLES
    ========================= */

    cables.forEach(c=>{

        let a =
        c.from.comp.id +
        "_" +
        c.from.borne.id;

        let b =
        c.to.comp.id +
        "_" +
        c.to.borne.id;

        conectar(
            conexiones,
            a,
            b
        );
    });

    /* =========================
       INTERRUPTORES
    ========================= */

    componentes.forEach(comp=>{

        /* SIMPLE */

        /* COMBINADA */

if(comp.type==="combinada"){

    if(!comp.state){

        conectar(
            conexiones,
            comp.id+"_comun",
            comp.id+"_via1"
        );
    }

    else{

        conectar(
            conexiones,
            comp.id+"_comun",
            comp.id+"_via2"
        );
    }
}

        if(
            comp.type==="simple" &&
            comp.state
        ){

            conectar(
                conexiones,
                comp.id+"_in",
                comp.id+"_out"
            );
        }

        /* PULSADOR */

        if(
            comp.type==="pulsador" &&
            comp.state
        ){

            conectar(
                conexiones,
                comp.id+"_in",
                comp.id+"_out"
            );
        }
    });

    /* =========================
   4 VIAS
========================= */

componentes.forEach(comp=>{

    if(comp.type!=="cuatrovias")
    return;

    /* RECTO */

    if(!comp.state){

        conectar(
            conexiones,
            comp.id+"_e1",
            comp.id+"_s1"
        );

        conectar(
            conexiones,
            comp.id+"_e2",
            comp.id+"_s2"
        );
    }

    /* CRUZADO */

    else{

        conectar(
            conexiones,
            comp.id+"_e1",
            comp.id+"_s2"
        );

        conectar(
            conexiones,
            comp.id+"_e2",
            comp.id+"_s1"
        );
    }
});

    /* =========================
       PALIER
    ========================= */

    componentes.forEach(comp=>{

        if(comp.type!=="palier3")
        return;

        let pulsado =
        existeCamino(
            conexiones,
            "termica_fase",
            comp.id+"_puls"
        );

        /* ACTIVA TIMER */

        if(pulsado){

            timers[comp.id] =
            Date.now()+5000;
        }

        /* MANTIENE SALIDA */

        if(

            timers[comp.id] &&

            Date.now() <
            timers[comp.id]

        ){

            conectar(
                conexiones,
                comp.id+"_fase",
                comp.id+"_puls"
            );
        }
    });

    /* =========================
       LAMPARAS
    ========================= */

    componentes.forEach(comp=>{

        if(comp.type!=="lampara")
        return;

        let faseOK =
        existeCamino(
            conexiones,
            "termica_fase",
            comp.id+"_fase"
        );

        let neutroOK =
        existeCamino(
            conexiones,
            "termica_neutro",
            comp.id+"_neutro"
        );

        comp.encendida =
        faseOK && neutroOK;
    });

    /* =========================
       CABLES ENERGIZADOS
    ========================= */

    cables.forEach(c=>{

        let a =
        c.from.comp.id +
        "_" +
        c.from.borne.id;

        let b =
        c.to.comp.id +
        "_" +
        c.to.borne.id;

        let energiaA =
        existeCamino(
            conexiones,
            "termica_fase",
            a
        );

        let energiaB =
        existeCamino(
            conexiones,
            "termica_fase",
            b
        );

        if(
            energiaA ||
            energiaB
        ){

            c.energizado = true;
        }
    });

    /* =========================
       CORTOCIRCUITO
    ========================= */

    for(let c of cables){

        let colorA =
        c.from.borne.color;

        let colorB =
        c.to.borne.color;

        let corto =

        (
            colorA==="red" &&
            colorB==="blue"
        )

        ||

        (
            colorB==="red" &&
            colorA==="blue"
        );

        if(corto){

            cortoCircuito = true;

            termica.state = false;

            return;
        }
    }

    /* =========================
       FUGA A TIERRA
    ========================= */

    for(let c of cables){

        let colorA =
        c.from.borne.color;

        let colorB =
        c.to.borne.color;

        let fuga =

        (
            colorA==="red" &&
            colorB==="green"
        )

        ||

        (
            colorB==="red" &&
            colorA==="green"
        );

        if(fuga){

            if(disyuntor){

                disyuntor.state = false;
            }

            return;
        }
    }
}

/* =========================
   CONECTAR
========================= */

function conectar(
    conexiones,
    a,
    b
){

    if(
        conexiones[a] &&
        conexiones[b]
    ){

        conexiones[a].push(b);

        conexiones[b].push(a);
    }
}

/* =========================
   BFS
========================= */

function existeCamino(
    grafo,
    inicio,
    fin
){

    if(
        !grafo[inicio] ||
        !grafo[fin]
    ){

        return false;
    }

    let visitados =
    new Set();

    let cola = [inicio];

    while(cola.length){

        let actual =
        cola.shift();

        if(actual===fin){

            return true;
        }

        if(
            visitados.has(actual)
        ) continue;

        visitados.add(actual);

        let vecinos =
        grafo[actual] || [];

        vecinos.forEach(v=>{

            if(
                !visitados.has(v)
            ){

                cola.push(v);
            }
        });
    }

    return false;
}