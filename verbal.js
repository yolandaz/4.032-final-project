var lightFont;
var plainFont;
var boldFont;

var screen1;
var screen1Hover;
var screen2;
var screen2HoverL;
var screen2HoverR;
var screen3;
var screen3HoverL;
var screen3HoverR;
var screen4;
var screen4HoverL;

var state = 1;

function preload() {
    lightFont = loadFont("data/SourceSansPro-Light.ttf");
    plainFont = loadFont("data/SourceSansPro-Regular.ttf");
    boldFont = loadFont("data/SourceSansPro-Semibold.ttf");

    data = loadTable("data/data.csv", "header");

    screen1 = loadImage("images/screen1.png");
    screen1Hover = loadImage("images/screen1-hover.png");
    screen2 = loadImage("images/screen2.png");
    screen2HoverL = loadImage("images/screen2-hoverL.png");
    screen2HoverR = loadImage("images/screen2-hoverR.png");
    screen3 = loadImage("images/screen3.png");
    screen3HoverL = loadImage("images/screen3-hoverL.png");
    screen3HoverR = loadImage("images/screen3-hoverR.png");
    screen4 = loadImage("images/screen4.png");
    screen4HoverL = loadImage("images/screen4-hoverL.png");
}

var totalFriends = 0;
var totalStrangers = 0;
var totalLong = 0;
var totalMedium = 0;
var totalShort = 0;

function setup() {
    createCanvas(960, 540);
    for (var day = 0; day < 7; day++) {
        totalFriends += parseInt(data.get(day, "Friend"));
        totalStrangers += parseInt(data.get(day, "Stranger"));
        totalLong += parseInt(data.get(day, "Long"));
        totalMedium += parseInt(data.get(day, "Medium"));
        totalShort += parseInt(data.get(day, "Short"));
    }
}

var p1L = 180;
var p2L = 475;
var pT = 70;
var pH = 385;
var pW = 295;
var flipSize = 40;

function checkBounds(x, y, w, h) {
    return mouseX > x && mouseY > y && mouseX < x+w && mouseY < y+h;
}

function draw() {
    if (state == 1) {
        if (checkBounds(p2L, pT, pW, pH)) {
            image(screen1Hover, 0, 0, width, height);
            cursor(HAND);
        } else {
            image(screen1, 0, 0, width, height);
            cursor(ARROW);
        }
    } else if (state == 2) {
        if (checkBounds(p2L+pW-flipSize, pT+pH-flipSize, flipSize, flipSize)) {
            image(screen2HoverR, 0, 0, width, height);
            cursor(HAND);
        } else if (checkBounds(p1L, pT+pH-flipSize, flipSize, flipSize)) {
            image(screen2HoverL, 0, 0, width, height);
            cursor(HAND);
        } else {
            image(screen2, 0, 0, width, height);
            cursor(ARROW);
        }
        drawDailyTotal();
    } else if (state == 3) {
        if (checkBounds(p2L+pW-flipSize, pT+pH-flipSize, flipSize, flipSize)) {
            image(screen3HoverR, 0, 0, width, height);
            cursor(HAND);
        } else if (checkBounds(p1L, pT+pH-flipSize, flipSize, flipSize)) {
            image(screen3HoverL, 0, 0, width, height);
            cursor(HAND);
        } else {
            image(screen3, 0, 0, width, height);
            cursor(ARROW);
        }
        drawFriendStranger();
        drawFriendStrangerPi();
    } else if (state == 4) {
        if (checkBounds(p1L, pT+pH-flipSize, flipSize, flipSize)) {
            image(screen4HoverL, 0, 0, width, height);
            cursor(HAND);
        } else {
            image(screen4, 0, 0, width, height);
            cursor(ARROW);
        }
        drawConvoLength();
        drawConvoLengthPi();
    }

}

function mouseClicked() {
    if (state == 1) {
        if (checkBounds(p2L, pT, pW, pH)) {
            state = 2;
        }
    } else if (state == 2) {
        if (checkBounds(p2L+pW-flipSize, pT+pH-flipSize, flipSize, flipSize)) {
            state = 3;
        } else if (checkBounds(p1L, pT+pH-flipSize, flipSize, flipSize)) {
            state = 1;
        }
    } else if (state == 3) {
        if (checkBounds(p2L+pW-flipSize, pT+pH-flipSize, flipSize, flipSize)) {
            state = 4;
        } else if (checkBounds(p1L, pT+pH-flipSize, flipSize, flipSize)) {
            state = 2;
        }
    } else if (state == 4) {
        if (checkBounds(p1L, pT+pH-flipSize, flipSize, flipSize)) {
            state = 3;
        }
    }
}

function drawDailyTotal() {
    var chartLeft = p2L+90;
    var chartRight = p2L+pW-40;
    var barWidth = 18;
    var chartTop = 190;
    var chartBottom = 350;
    var legendHigh = 70;
    var legendLow = 0;

    var color = "#2c3e50";

    fill(0);
    textFont(plainFont, 12);

    // draw the bars
    strokeWeight(barWidth);
    strokeCap(SQUARE);
    textAlign(CENTER);
    for (var day = 0; day < 7; day++) {
        var dayData = data.get(day, "Total");
        var x = map(day, 0, 6, chartLeft, chartRight);
        var y = map(dayData, legendHigh, legendLow, chartTop, chartBottom);
        stroke(color);
        line(x, chartBottom, x, y);
        noStroke();
        text(day+1, x, 365);
        // check hover
        if (checkBounds(x-barWidth/2, y, barWidth, chartBottom-y)) {
            fill(255);
            text(dayData, x, y+8);
            fill(0);
        }
    }

    // draw the left numbers
    textAlign(RIGHT, CENTER);
    for (var ppl = legendLow; ppl <= legendHigh; ppl += 10) {
        var legendY = map(ppl, legendLow, legendHigh, chartBottom, chartTop);
        text(ppl, p2L+70, legendY);
    }

    // draw labels
    textFont(boldFont, 12);
    text("Day", (chartLeft+chartRight)/2, 390);
    translate(p2L+40, (chartTop+chartBottom)/2);
    rotate(-HALF_PI);
    text("People", 0, 0);
}

function drawFriendStranger() {
    var chartLeft = p1L+60;
    var chartRight = p1L+pW-50;
    var barWidth = 12;
    var chartTop = 190;
    var chartBottom = 320;
    var legendHigh = 60;
    var legendLow = 0;

    var cF = "#9b59b6";
    var cS = "#3498db";

    fill(0);
    textFont(plainFont, 12);

    // draw the bars
    strokeWeight(barWidth);
    strokeCap(SQUARE);
    textAlign(CENTER);
    for (var day = 0; day < 7; day++) {
        var dayFriend = data.get(day, "Friend");
        var dayStranger = data.get(day, "Stranger");
        var x = map(day, 0, 6, chartLeft, chartRight);
        var yF = map(dayFriend, legendHigh, legendLow, chartTop, chartBottom);
        var yS = map(dayStranger, legendHigh, legendLow, chartTop, chartBottom);
        stroke(cF);
        line(x-barWidth/2, chartBottom, x-barWidth/2, yF);
        stroke(cS);
        line(x+barWidth/2, chartBottom, x+barWidth/2, yS);
        noStroke();
        text(day+1, x, 330);
        // check hover
        if (checkBounds(x-barWidth, yF, barWidth, chartBottom-yF)) {
            fill(cF);
            text(dayFriend, x-barWidth/2, yF-10);
            fill(0);
        } else if (checkBounds(x, yS, barWidth, chartBottom-yS)) {
            fill(cS);
            text(dayStranger, x+barWidth/2, yS-10);
            fill(0);
        }
    }

    // draw the left numbers
    textAlign(RIGHT, CENTER);
    for (var ppl = legendLow; ppl <= legendHigh; ppl += 10) {
        var legendY = map(ppl, legendLow, legendHigh, chartBottom, chartTop);
        text(ppl, p1L+40, legendY);
    }

    // draw color legend
    var blockSize = 12;
    var legendL = 300;
    var legendT = 365;
    var legendSpace = 8;
    textAlign(LEFT);
    fill(cF);
    rect(legendL, legendT, blockSize, blockSize);
    text("Friends", legendL+blockSize+legendSpace, legendT+4);
    fill(cS);
    rect(legendL, legendT+blockSize+legendSpace, blockSize, blockSize);
    text("Strangers", legendL+blockSize+legendSpace, legendT+blockSize+legendSpace+4);

    // draw labels
    textAlign(CENTER);
    fill(0);
    textFont(boldFont, 12);
    text("Day", (chartLeft+chartRight)/2, 345);
    push()
    translate(p1L+15, (chartTop+chartBottom)/2);
    rotate(-HALF_PI);
    text("Amount", 0, 0);
    pop();
}

function drawFriendStrangerPi() {
    var cF = "#9b59b6";
    var cS = "#3498db";
    textFont(plainFont, 12);

    var eX = 635;
    var eY = 260;
    var eSize = 140;

    fill(cF);
    ellipse(eX, eY, eSize, eSize);
    fill(cS);
    arc(eX, eY, eSize, eSize, 0, map(totalStrangers, 0, totalFriends+totalStrangers, 0, TWO_PI));

    // check hover
    fill(255);
    textFont(boldFont, 24);
    if (checkBounds(540, 180, 190, 160)) {
        if (JSON.stringify(get(mouseX, mouseY)) == "[155,89,182,255]") {
            text(totalFriends, 610, 235);
        } else if (JSON.stringify(get(mouseX, mouseY)) == "[52,152,219,255]") {
            text(totalStrangers, 665, 290);
        }
    }

    // draw color legend
    var blockSize = 12;
    var legendL = 610;
    var legendT = 365;
    var legendSpace = 8;
    textAlign(LEFT);
    textFont(plainFont, 12);
    fill(cF);
    rect(legendL, legendT, blockSize, blockSize);
    text("Friends", legendL+blockSize+legendSpace, legendT+4);
    fill(cS);
    rect(legendL, legendT+blockSize+legendSpace, blockSize, blockSize);
    text("Strangers", legendL+blockSize+legendSpace, legendT+blockSize+legendSpace+4);
}

function drawConvoLength() {
    var chartLeft = p1L+60;
    var chartRight = p1L+pW-50;
    var barWidth = 18;
    var chartTop = 190;
    var chartBottom = 320;
    var legendHigh = 60;
    var legendLow = 0;

    var cS = "#2980b9";
    var cM = "#c0392b";
    var cL = "#9b59b6";

    fill(0);
    textFont(plainFont, 12);

    // draw the bars
    strokeWeight(barWidth);
    strokeCap(SQUARE);
    textAlign(CENTER);
    for (var day = 0; day < 7; day++) {
        var dayS = parseInt(data.get(day, "Short"));
        var dayM = parseInt(data.get(day, "Medium"));
        var dayL = parseInt(data.get(day, "Long"));
        var x = map(day, 0, 6, chartLeft, chartRight);
        var yS = map(dayS, legendHigh, legendLow, chartTop, chartBottom);
        var yM = map(dayM + dayS, legendHigh, legendLow, chartTop, chartBottom);
        var yL = map(dayL + dayM + dayS, legendHigh, legendLow, chartTop, chartBottom);
        stroke(cL);
        line(x, chartBottom, x, yL);
        stroke(cM);
        line(x, chartBottom, x, yM);
        stroke(cS);
        line(x, chartBottom, x, yS);
        noStroke();
        text(day+1, x, 330);
        // check hover
        if (checkBounds(x-barWidth/2, 175, barWidth, 150)) {
            if (JSON.stringify(get(mouseX, mouseY)) == "[41,128,185,255]") { // short
                fill(cS);
                text(dayS, x, yL-10);
            } else if (JSON.stringify(get(mouseX, mouseY)) == "[192,57,43,255]") { // medium
                fill(cM);
                text(dayM, x, yL-10);
            } else if (JSON.stringify(get(mouseX, mouseY)) == "[155,89,182,255]") { // long
                fill(cL);
                text(dayL, x, yL-10);
            }
        }
        fill(0);
    }

    // draw the left numbers
    textAlign(RIGHT, CENTER);
    for (var ppl = legendLow; ppl <= legendHigh; ppl += 10) {
        var legendY = map(ppl, legendLow, legendHigh, chartBottom, chartTop);
        text(ppl, p1L+40, legendY);
    }

    // draw color legend
    var blockSize = 12;
    var legendL = 300;
    var legendT = 365;
    var legendSpace = 8;
    textAlign(LEFT);
    fill(cS);
    rect(legendL, legendT, blockSize, blockSize);
    text("Short", legendL+blockSize+legendSpace, legendT+4);
    fill(cM);
    rect(legendL, legendT+blockSize+legendSpace, blockSize, blockSize);
    text("Medium", legendL+blockSize+legendSpace, legendT+blockSize+legendSpace+4);
    fill(cL);
    rect(legendL, legendT+(blockSize+legendSpace)*2, blockSize, blockSize);
    text("Long", legendL+blockSize+legendSpace, legendT+(blockSize+legendSpace)*2+4);

    // draw labels
    textAlign(CENTER);
    fill(0);
    textFont(boldFont, 12);
    text("Day", (chartLeft+chartRight)/2, 345);
    push()
    translate(p1L+15, (chartTop+chartBottom)/2);
    rotate(-HALF_PI);
    text("Amount", 0, 0);
    pop();
}

function drawConvoLengthPi() {
    var cS = "#2980b9";
    var cM = "#c0392b";
    var cL = "#9b59b6";

    textFont(plainFont, 12);

    var eX = 635;
    var eY = 260;
    var eSize = 140;

    fill(cL);
    ellipse(eX, eY, eSize, eSize);
    fill(cM);
    arc(eX, eY, eSize, eSize, 0, map(totalMedium, 0, totalLong+totalMedium+totalShort, 0, TWO_PI));
    fill(cS);
    arc(eX, eY, eSize, eSize, -map(totalShort, 0, totalLong+totalMedium+totalShort, 0, TWO_PI), 0);

    // check hover
    fill(255);
    textFont(boldFont, 24);
    if (checkBounds(540, 180, 190, 160)) {
        if (JSON.stringify(get(mouseX, mouseY)) == "[41,128,185,255]") { // short
            text(totalShort, 647, 224);
        } else if (JSON.stringify(get(mouseX, mouseY)) == "[192,57,43,255]") { // medium
            text(totalMedium, 662, 295);
        } else if (JSON.stringify(get(mouseX, mouseY)) == "[155,89,182,255]") { // long
            text(totalLong, 598, 279);
        }
    }

    // draw color legend
    var blockSize = 12;
    var legendL = 610;
    var legendT = 365;
    var legendSpace = 8;
    textAlign(LEFT);
    textFont(plainFont, 12);
    fill(cS);
    rect(legendL, legendT, blockSize, blockSize);
    text("Short", legendL+blockSize+legendSpace, legendT+4);
    fill(cM);
    rect(legendL, legendT+blockSize+legendSpace, blockSize, blockSize);
    text("Medium", legendL+blockSize+legendSpace, legendT+blockSize+legendSpace+4);
    fill(cL);
    rect(legendL, legendT+(blockSize+legendSpace)*2, blockSize, blockSize);
    text("Long", legendL+blockSize+legendSpace, legendT+(blockSize+legendSpace)*2+4);
}

function mousePressed() {
    // console.log(mouseX, mouseY);
    // console.log(JSON.stringify(get(mouseX, mouseY)));
}