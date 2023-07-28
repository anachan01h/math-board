/* -----------------------------------------------------------------------------
 * # Math Board
 * A virtual chalkboard where you can write math using LaTeX notation
 *
 * Copyright (c) 2022 anachan01h
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not 
 * use this file except in compliance with the License. You may obtain a copy 
 * of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software 
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT 
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the 
 * License for the specific language governing permissions and limitations 
 * under the License.
----------------------------------------------------------------------------- */

// MathJax Config --------------------------------------------------------------
window.MathJax = {
    tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']]
    }
};

// Global variables ------------------------------------------------------------
const env = document.getElementById("env");
let canvas = document.getElementById("painting-area");
let ctx = canvas.getContext("2d");
let tool;

// Canvas Config ---------------------------------------------------------------
changeTool(0);
updateSize();

window.addEventListener("resize", updateSize);

// Update Canvas Size ----------------------------------------------------------
function updateSize() {
    const promise = createImageBitmap(canvas);
    ctx.canvas.width = window.innerWidth - 32 - 6;
    ctx.canvas.height = Math.floor(0.85 * (window.innerHeight - 32) - 13 - 6);
    promise.then(
        function (bitmap) {
            ctx.drawImage(bitmap, 0, 0);
        }
    );
    return;
}

// Change Tools ----------------------------------------------------------------
function changeTool(n) {
    tool = n;
    if (tool === 0) {
        canvas.style.pointerEvents = "none";
    } else {
        canvas.style.pointerEvents = "auto";
    }
    return;
}

// Get Cursor Position ---------------------------------------------------------
function getPosition(event, element) {
    return {
        x: event.pageX - element.offsetLeft,
        y: event.pageY - element.offsetTop,
    };
}

// Paint Events ----------------------------------------------------------------
function draw(event) {
    const pos = getPosition(event, canvas);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
}

function finishDraw(event) {
    draw(event);
    ctx.closePath();
}

function erase(event) {
    const pos = getPosition(event, canvas);
    ctx.clearRect(pos.x - 20, pos.y - 20, 40, 40);
}

const hMove = function (event) {
    draw(event);
};

canvas.addEventListener("mousedown", function (event) {
    if (event.button === 0) {
        if (tool === 1) {
            const pos = getPosition(event, canvas);

            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
            ctx.strokeStyle = "#FFF";
            ctx.lineWidth = 2;

            canvas.addEventListener("mousemove", draw);
        } else {
            canvas.addEventListener("mousemove", erase);
        }
    }
});

canvas.addEventListener("mouseup", function (event) {
    if (tool === 1) {
        finishDraw(event);
        canvas.removeEventListener("mousemove", draw);
    } else {
        canvas.removeEventListener("mousemove", erase);
    }
});

// Box Events ------------------------------------------------------------------

function createBox() {
    // Create box
    const box = document.createElement("div");
    const text = document.forms["form"]["input"].value;
    const text_node = document.createTextNode(text);
    box.appendChild(text_node);
    env.appendChild(box);

    // Configure box
    box.style.position = "absolute";
    box.style.left = "50px";
    box.style.top = "50px";
    box.style.zIndex = "3000";
    box.style.fontSize = "32pt";
    window.MathJax.typeset();

    // Event Listeners
    box.addEventListener("mouseenter", function () {
        showBorder(box);
    });
    box.addEventListener("mouseleave", function () {
        hideBorder(box);
    });
    const handler = function (event) {
        moveBox(box, event);
    }
    box.addEventListener("mousedown", function (event) {
        if (event.button === 0) {
            selectBox(box, event, handler);
        } else if (event.button === 2) {
            deleteBox(box);
        }
    });
    box.addEventListener("mouseup", function (event) {
        if (event.button === 0) {
            dropBox(handler);
        }
    });
}

function createEventHandler(box, handler) {
    return function (event) {
        handler(box, event);
    }
}

function showBorder(box) {
    box.style.border = "1px solid red";
}

function hideBorder(box) {
    box.style.border = "";
}

function selectBox(box, event, handler) {
    box.posx = event.pageX - parseInt(box.style.left, 10);
    box.posy = event.pageY - parseInt(box.style.top, 10);
    document.addEventListener("mousemove", handler);
}

function dropBox(handler) {
    document.removeEventListener("mousemove", handler);
}

function moveBox(box, event) {
    box.style.top = event.pageY - box.posy + "px";
    box.style.left = event.pageX - box.posx + "px";
}

function deleteBox(box) {
    box.remove();
}
