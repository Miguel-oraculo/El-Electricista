function render() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.save();

    ctx.setTransform(
        zoom,
        0,
        0,
        zoom,
        offsetCanvasX,
        offsetCanvasY
    );

/* =========================
   FLASH CORTO
========================= */

if (cortoCircuito) {

    ctx.fillStyle =
        "rgba(255,0,0,0.15)";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );
}

/* =========================
   GRID
========================= */

ctx.strokeStyle = "#1e293b";

ctx.lineWidth = 1;

for (let x = 0; x < canvas.width; x += 25) {

    ctx.beginPath();

    ctx.moveTo(x, 0);

    ctx.lineTo(
        x,
        canvas.height
    );

    ctx.stroke();
}

for (let y = 0; y < canvas.height; y += 25) {

    ctx.beginPath();

    ctx.moveTo(0, y);

    ctx.lineTo(
        canvas.width,
        y
    );

    ctx.stroke();
}

/* =========================
   CABLES
========================= */

cables.forEach(c => {

    let x1 =
        c.from.comp.x +
        c.from.borne.x;

    let y1 =
        c.from.comp.y +
        c.from.borne.y;

    let x2 =
        c.to.comp.x +
        c.to.borne.x;

    let y2 =
        c.to.comp.y +
        c.to.borne.y;

    let cx =
        (x1 + x2) / 2;

    let cy =
        Math.max(y1, y2) + 40;

    ctx.beginPath();

    ctx.moveTo(x1, y1);

    ctx.quadraticCurveTo(
        cx,
        cy,
        x2,
        y2
    );

    ctx.strokeStyle =
        c.color;

    ctx.lineWidth =
        c.energizado
            ? 7
            : 4;

    ctx.shadowBlur =
        c.energizado
            ? 25
            : 5;

    ctx.shadowColor =
        c.color;

    ctx.stroke();

    /* =========================
       ELECTRICIDAD ANIMADA
    ========================= */

    if (c.energizado) {

        ctx.beginPath();

        ctx.moveTo(x1, y1);

        ctx.quadraticCurveTo(
            cx,
            cy,
            x2,
            y2
        );

        ctx.strokeStyle =
            "#ffffff";

        ctx.lineWidth = 2;

        ctx.setLineDash([12, 18]);

        ctx.lineDashOffset =
            -energiaOffset * 40;

        ctx.shadowBlur = 15;

        ctx.shadowColor =
            "#ffffff";

        ctx.stroke();

        ctx.setLineDash([]);
    }

    ctx.shadowBlur = 0;
});

/* =========================
   COMPONENTES
========================= */

componentes.forEach(comp => {

    if (!comp) return;

    /* =========================
       TERMICA
    ========================= */

    if (comp.type === "termica") {

        ctx.fillStyle =
            comp.state
                ? "#166534"
                : "#374151";

        ctx.fillRect(
            comp.x,
            comp.y,
            comp.w,
            comp.h
        );

        ctx.strokeStyle =
            "#cbd5e1";

        ctx.strokeRect(
            comp.x,
            comp.y,
            comp.w,
            comp.h
        );

        ctx.fillStyle = "#fff";

        ctx.font =
            "bold 15px Arial";

        ctx.fillText(
            "TERMICA",
            comp.x + 8,
            comp.y + 30
        );

        ctx.fillStyle =
            comp.state
                ? "#22c55e"
                : "#ef4444";

        ctx.fillRect(
            comp.x + 25,
            comp.y + 60,
            40,
            70
        );
    }

    /* =========================
       DISYUNTOR
    ========================= */

    else if (comp.type === "disyuntor") {

        ctx.fillStyle =
            comp.state
                ? "#0f766e"
                : "#374151";

        ctx.fillRect(
            comp.x,
            comp.y,
            comp.w,
            comp.h
        );

        ctx.strokeStyle =
            "#cbd5e1";

        ctx.strokeRect(
            comp.x,
            comp.y,
            comp.w,
            comp.h
        );

        ctx.fillStyle = "#fff";

        ctx.font =
            "bold 14px Arial";

        ctx.fillText(
            "DISY",
            comp.x + 18,
            comp.y + 30
        );

        ctx.fillStyle =
            comp.state
                ? "#14b8a6"
                : "#ef4444";

        ctx.fillRect(
            comp.x + 25,
            comp.y + 60,
            40,
            70
        );
    }

    /* =========================
       LAMPARA
    ========================= */

    else if (comp.type === "lampara") {

        ctx.fillStyle = "#374151";

        ctx.fillRect(
            comp.x,
            comp.y,
            comp.w,
            comp.h
        );

        ctx.beginPath();

        ctx.arc(
            comp.x + 45,
            comp.y + 35,
            28,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            comp.encendida
                ? "#fde047"
                : "#4b5563";

        ctx.fill();

        ctx.strokeStyle = "#fff";

        ctx.stroke();
    }

    /* =========================
       INTERRUPTOR SIMPLE
    ========================= */

    else if (comp.type === "simple") {

        ctx.fillStyle = "#374151";

        ctx.fillRect(
            comp.x,
            comp.y,
            comp.w,
            comp.h
        );

        ctx.strokeStyle = "#cbd5e1";

        ctx.strokeRect(
            comp.x,
            comp.y,
            comp.w,
            comp.h
        );

        ctx.beginPath();

        ctx.lineWidth = 6;

        ctx.strokeStyle = "#fff";

        if (comp.state) {

            ctx.moveTo(
                comp.x + 35,
                comp.y + 35
            );

            ctx.lineTo(
                comp.x + 35,
                comp.y + 90
            );
        }

        else {

            ctx.moveTo(
                comp.x + 25,
                comp.y + 90
            );

            ctx.lineTo(
                comp.x + 45,
                comp.y + 40
            );
        }

        ctx.stroke();
    }
    /* =========================
       4 VIAS
    ========================= */

    else if (comp.type === "cuatrovias") {

        ctx.fillStyle = "#374151";

        ctx.fillRect(
            comp.x,
            comp.y,
            comp.w,
            comp.h
        );

        ctx.strokeStyle = "#cbd5e1";

        ctx.strokeRect(
            comp.x,
            comp.y,
            comp.w,
            comp.h
        );

        ctx.strokeStyle = "#fff";

        ctx.lineWidth = 5;

        ctx.beginPath();

        if (!comp.state) {

            /* RECTO */

            ctx.moveTo(
                comp.x + 20,
                comp.y + 20
            );

            ctx.lineTo(
                comp.x + 20,
                comp.y + 120
            );

            ctx.moveTo(
                comp.x + 70,
                comp.y + 20
            );

            ctx.lineTo(
                comp.x + 70,
                comp.y + 120
            );
        }

        else {

            /* CRUZADO */

            ctx.moveTo(
                comp.x + 20,
                comp.y + 20
            );

            ctx.lineTo(
                comp.x + 70,
                comp.y + 120
            );

            ctx.moveTo(
                comp.x + 70,
                comp.y + 20
            );

            ctx.lineTo(
                comp.x + 20,
                comp.y + 120
            );
        }

        ctx.stroke();
    }

    /* =========================
       PALIER 3H
    ========================= */

    else if (comp.type === "palier3") {

        ctx.fillStyle = "#374151";

        ctx.fillRect(
            comp.x,
            comp.y,
            comp.w,
            comp.h
        );

        ctx.strokeStyle = "#cbd5e1";

        ctx.strokeRect(
            comp.x,
            comp.y,
            comp.w,
            comp.h
        );

        /* TEXTO */

        ctx.fillStyle = "#fff";

        ctx.font = "bold 14px Arial";

        ctx.fillText(
            "PALIER",
            comp.x + 20,
            comp.y + 30
        );

        ctx.fillText(
            "3H",
            comp.x + 40,
            comp.y + 50
        );

        /* RELOJ */

        ctx.beginPath();

        ctx.arc(
            comp.x + 55,
            comp.y + 90,
            22,
            0,
            Math.PI * 2
        );

        ctx.strokeStyle = "#facc15";

        ctx.lineWidth = 4;

        ctx.stroke();

        /* AGUJA */

        ctx.beginPath();

        ctx.moveTo(
            comp.x + 55,
            comp.y + 90
        );

        ctx.lineTo(
            comp.x + 55,
            comp.y + 75
        );

        ctx.stroke();
    }

    /* =========================
       COMBINADA
    ========================= */

    else if (comp.type === "combinada") {

        ctx.fillStyle = "#374151";

        ctx.fillRect(
            comp.x,
            comp.y,
            comp.w,
            comp.h
        );

        ctx.strokeStyle = "#cbd5e1";

        ctx.lineWidth = 2;

        ctx.strokeRect(
            comp.x,
            comp.y,
            comp.w,
            comp.h
        );

        ctx.beginPath();

        ctx.strokeStyle = "#ffffff";

        ctx.lineWidth = 5;

        if (comp.state) {

            /* POSICION 2 */

            ctx.moveTo(
                comp.x + 40,
                comp.y + 30
            );

            ctx.lineTo(
                comp.x + 60,
                comp.y + 100
            );
        }

        else {

            /* POSICION 1 */

            ctx.moveTo(
                comp.x + 40,
                comp.y + 30
            );

            ctx.lineTo(
                comp.x + 20,
                comp.y + 100
            );
        }

        ctx.stroke();
    }
    /* =========================
       PULSADOR
    ========================= */

    else if (comp.type === "pulsador") {

        ctx.fillStyle = "#374151";

        ctx.fillRect(
            comp.x,
            comp.y,
            comp.w,
            comp.h
        );

        ctx.strokeStyle = "#cbd5e1";

        ctx.strokeRect(
            comp.x,
            comp.y,
            comp.w,
            comp.h
        );

        ctx.beginPath();

        ctx.arc(
            comp.x + 35,
            comp.y + 60,
            comp.state ? 14 : 18,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            comp.state
                ? "#ef4444"
                : "#9ca3af";

        ctx.fill();
    }

    /* =========================
4 VIAS
========================= */

    else if (comp.type === "cuatrovias") {

        ctx.fillStyle = "#374151";

        ctx.fillRect(
            comp.x,
            comp.y,
            comp.w,
            comp.h
        );

        ctx.strokeStyle = "#cbd5e1";

        ctx.strokeRect(
            comp.x,
            comp.y,
            comp.w,
            comp.h
        );

        ctx.beginPath();

        ctx.lineWidth = 5;

        ctx.strokeStyle = "#ffffff";

        if (!comp.state) {

            /* RECTO */

            ctx.moveTo(
                comp.x + 20,
                comp.y + 20
            );

            ctx.lineTo(
                comp.x + 20,
                comp.y + 120
            );

            ctx.moveTo(
                comp.x + 70,
                comp.y + 20
            );

            ctx.lineTo(
                comp.x + 70,
                comp.y + 120
            );
        }

        else {

            /* CRUZADO */

            ctx.moveTo(
                comp.x + 20,
                comp.y + 20
            );

            ctx.lineTo(
                comp.x + 70,
                comp.y + 120
            );

            ctx.moveTo(
                comp.x + 70,
                comp.y + 20
            );

            ctx.lineTo(
                comp.x + 20,
                comp.y + 120
            );
        }

        ctx.stroke();

        ctx.fillStyle = "#ffffff";

        ctx.font = "12px Arial";

        ctx.fillText(
            "4 VIAS",
            comp.x + 14,
            comp.y + 72
        );
    }

    /* =========================
       BORNES
    ========================= */

    comp.bornes.forEach(b => {

        let bx =
            comp.x + b.x;

        let by =
            comp.y + b.y;

        ctx.beginPath();

        ctx.arc(
            bx,
            by,
            8,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            b.color;

        ctx.fill();

        ctx.strokeStyle = "#fff";

        ctx.stroke();
    });
});

/* =========================
TEXTO CORTO
========================= */

if (cortoCircuito) {

    ctx.fillStyle = "#ff0000";

    ctx.font =
        "bold 48px Arial";

    ctx.fillText(
        "⚠ CORTOCIRCUITO",
        60,
        80
    );
}

/* =========================
   RESTORE ZOOM
========================= */

ctx.restore();
}