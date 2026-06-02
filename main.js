alert("main cargado");
const canvas =
document.getElementById("canvas");

const ctx =
canvas.getContext("2d");

/************************
PAN DEL TABLERO
************************/

let panning = false;

let panStartX = 0;

let panStartY = 0;


/* =========================
   CANVAS
========================= */

function resizeCanvas(){

    canvas.width =
    window.innerWidth;

    canvas.height =
    window.innerHeight - 90;

    if(typeof render === "function"){

        render();
    }
}

resizeCanvas();

window.addEventListener(
    "resize",
    resizeCanvas
);

/* =========================
   MOUSE
========================= */

canvas.addEventListener(
    "mousedown",
    manejarMouseDown
);

canvas.addEventListener(
    "mousemove",
    manejarMouseMove
);

canvas.addEventListener(
    "mouseup",
    ()=>{

        dragging = null;

        panning = false;
    }
);

/* =========================
   TOUCH START
========================= */

canvas.addEventListener(
    "touchstart",
    e=>{

        if(e.touches.length === 1){

            let t =
            e.touches[0];

            manejarMouseDown({

                clientX:t.clientX,
                clientY:t.clientY
            });
        }

        if(e.touches.length === 2){

            dragging = null;

            let t1 =
            e.touches[0];

            let t2 =
            e.touches[1];

            let dx =
            t2.clientX - t1.clientX;

            let dy =
            t2.clientY - t1.clientY;

            lastTouchDistance =
            Math.hypot(dx,dy);
        }

        e.preventDefault();
    },

    { passive:false }
);

/* =========================
   TOUCH MOVE
========================= */

canvas.addEventListener(
    "touchmove",
    e=>{

        if(e.touches.length === 2){

            dragging = null;

            let t1 =
            e.touches[0];

            let t2 =
            e.touches[1];

            let dx =
            t2.clientX - t1.clientX;

            let dy =
            t2.clientY - t1.clientY;

            let distancia =
            Math.hypot(dx,dy);

            if(lastTouchDistance){

                let factor =
                distancia /
                lastTouchDistance;

                zoom *= factor;

                zoom = Math.max(
                    0.5,
                    Math.min(
                        zoom,
                        3
                    )
                );
            }

            lastTouchDistance =
            distancia;

            render();
        }

        else if(e.touches.length === 1){

            let t =
            e.touches[0];

            manejarMouseMove({

                clientX:t.clientX,
                clientY:t.clientY
            });
        }

        e.preventDefault();
    },

    { passive:false }
);

/* =========================
   TOUCH END
========================= */

canvas.addEventListener(
    "touchend",
    ()=>{

        dragging = null;

        panning = false;

        lastTouchDistance = 0;
    }
);

/* =========================
   WHEEL ZOOM
========================= */

canvas.addEventListener(
    "wheel",
    e=>{

        e.preventDefault();

        if(e.deltaY < 0){

            zoom += 0.1;
        }

        else{

            zoom -= 0.1;
        }

        zoom = Math.max(
            0.5,
            Math.min(
                zoom,
                3
            )
        );

        render();
    }
);

/* =========================
   MANEJAR DOWN
========================= */

function manejarMouseDown(e){

    let rect =
    canvas.getBoundingClientRect();

    let mx =
    (e.clientX -
    rect.left -
    offsetCanvasX) /
    zoom;

    let my =
    (e.clientY -
    rect.top -
    offsetCanvasY) /
    zoom;

    for(let comp of componentes){

        for(let b of comp.bornes){

            let bx =
            comp.x + b.x;

            let by =
            comp.y + b.y;

            let dist =
            Math.hypot(
                mx - bx,
                my - by
            );

            if(dist < 10){

                if(!seleccionCable){

                    seleccionCable = {

                        comp,
                        borne:b
                    };
                }

                else{

                    cables.push({

                        from:
                        seleccionCable,

                        to:{
                            comp,
                            borne:b
                        },

                        color:
                        colorCable,

                        energizado:false
                    });

                    seleccionCable =
                    null;
                }

                return;
            }
        }
    }

    let clicEnComponente = false;

    for(let comp of componentes){

        if(

            mx >= comp.x &&
            mx <= comp.x + comp.w &&

            my >= comp.y &&
            my <= comp.y + comp.h

        ){
            clicEnComponente = true;

            dragging = comp;

            offsetX =
            mx - comp.x;

            offsetY =
            my - comp.y;

            if(

                comp.type==="simple" ||
                comp.type==="combinada" ||
                comp.type==="cuatrovias" ||
                comp.type==="termica" ||
                comp.type==="disyuntor"

            ){

                comp.state =
                !comp.state;
            }

            if(comp.type==="pulsador"){

                comp.state = true;

                setTimeout(()=>{

                    comp.state =
                    false;

                },200);
            }

            actualizarElectricidad();

            render();

            return;
        }
    }
    if(!clicEnComponente){

    panning = true;

    panStartX = e.clientX;

    panStartY = e.clientY;
}
}

/* =========================
   MANEJAR MOVE
========================= */

function manejarMouseMove(e){

    if(panning){

    offsetCanvasX +=
    e.clientX - panStartX;

    offsetCanvasY +=
    e.clientY - panStartY;

    panStartX =
    e.clientX;

    panStartY =
    e.clientY;

    render();

    return;
}

    if(!dragging)
    return;

    let rect =
    canvas.getBoundingClientRect();

    let mx =
    (e.clientX -
    rect.left -
    offsetCanvasX) /
    zoom;

    let my =
    (e.clientY -
    rect.top -
    offsetCanvasY) /
    zoom;

    dragging.x =
    mx - offsetX;

    dragging.y =
    my - offsetY;

    render();
}

/* =========================
   LOOP
========================= */

function loop(){

    try{

        actualizarElectricidad();

        energiaOffset += 0.05;

        render();
    }

    catch(err){

        console.log(err);
    }

    requestAnimationFrame(
        loop
    );
}

loop();