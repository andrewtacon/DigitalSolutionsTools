let style = `<style>

h2 {
    margin:3px;
    text-transform: uppercase;
}
 h4 {
     margin: 0px 0px 0px 3px;
 }

 
table,td {
    border: 3px solid white;
    border-collapse: collapse;
}

td {
    border-bottom: 12px solid white;
    border-right: 5px solid white;
}

td {
    height: 1px;
}


tr.bordered {
border-bottom: 1px solid #000;
}

.firstColumn {
    font-weight: bold;
    border: none !important;
    box-shadow: none !important;
    text-align: right;
    padding: 5px;
    text-transform: none !important;
    font-size: 16px !important;
}

.topRow {
    font-weight: bold;
    padding: 5px;
    border: 1px solid black;
    box-shadow: 3px 3px;
    font-size: 21px;
    text-transform: uppercase;

}

.note {
    width: 80px;
    min-height: 80px;
    height: 100%;
    padding: 5px;
    border: 1px solid black;
    display: flex;
    justify-content: center;
    align-items: center;
    word-wrap: break-word;
    text-align:center;
    font-weight: bold;
    box-shadow: 3px 3px;
}

.firstColumn {
padding-right: 10px;
}

.section0, .section6 {
    background-color: #FF9933; /* neon orange */
}

.section1, .section7 {
    background-color: #FFcc33 ; /*sunglow */
}

.section2, .section8 {
    background-color: #FFFF66; /* laser lemon */
}

.section3, .section9 {
    background-color: #AAF0D1; /* magic mint */
}

.section4,.section10 {
    background-color: #50BFE6; /*blizzard blue */
}

.section5, .section11 {
    background-color: #ee34d2; /* razzle dazzle rose */
}

.sectiongreen {
    background-color: #66ff66; /* screaming green */	
}

.sectionred {
    background-color: #ff355e; /* radical red */	
}

.sectionwhite {
    background-color: #ffffff; 	
}


</style>
`

const fs = require('fs');


let title = "";
let subtitle = "";
let columns = [];

async function getData(filename) {

    var lineReader = require('readline').createInterface({
        input: require('fs').createReadStream(filename)
    });

    let textRows = 0;
    let allData = []
    for await (const l of lineReader) {
        let line = l.trim();
        if (l.length===0) continue;
        allData.push(l)
        if (!line.startsWith('title') && !line.startsWith('section') && !line.startsWith('subtitle')) {
            let lines = line.split(":");
            let boxes = lines[0].split(",")
            if (boxes.length > textRows) {
                textRows = boxes.length;
            }
        }
    };


    let lastsection = "";
    let sectionUsed = false;
    let allUsers = [];
    let sectionCount = 0;
    let sectionStart = 0;
    let counter = 0;

    for (const l of allData) {
        let line = l.trim();
        if (line.startsWith('title')) {
            title = line.substring(5).trim();
        } else if (line.startsWith('subtitle')) {
            subtitle = line.substring(8).trim();
        } else if (line.startsWith("section")) {
            lastsection = line.substring(7).trim();
            sectionUsed = false;
        } else {
            let lines = line.split(":");
            let boxes = [];
            let texts = lines[0].split(',')
            for (let i = 0; i < textRows; i++) {
                if (i < texts.length) {
                    boxes[i] = texts[i].trim()
                } else {
                    boxes[i] = "";
                }
            }
            let score = lines[1].trim();
            let users = []
            if (lines[2]) {
                users = lines[2].split(',')
                for (let i = 0; i < users.length; i++) {
                    users[i] = users[i].trim()
                }
            }
            allUsers = allUsers.concat(users)
            let section = ""
            if (!sectionUsed) {
                section = lastsection
                sectionCount = 0
                sectionStart = counter
                sectionUsed = true
            }
            sectionCount++;
            let column = {
                text: boxes,
                score: score,
                users: users,
                section: section,
                sectionCount: sectionCount
            }

            columns.push(column)
            if (sectionCount > 1) {
                columns[sectionStart].sectionCount = sectionCount
            }
            counter++;
        }

    }


    let min = 10000000;
    let max = -10000000
    for (let i = 0; i < columns.length; i++) {
        if (min > columns[i].score) { min = columns[i].score; }
        if (max < columns[i].score) { max = columns[i].score; }
    }

    generate(title, columns, textRows, min, max);


}


function generate(title, columns, rows, min, max) {
    //  console.log(title)
    //  console.log(columns);
    let page = ``;
    //    page += `<h1>${title}</h1>`

    page += `<table><tr><td></td><td colspan="${columns[0].text.length + 1}"><h2>${title}</h2><h4>${subtitle}</h4></td></tr><tr>`


    let sectionNumber = 0;
    for (let i = 0; i < columns.length; i++) {
        if (columns[i].section !== "") {
            if (i === 0) {
                page += `<td  colspan="${columns[i].sectionCount}"><div class="topRow firstColumn">${columns[i].section.replaceAll(" ", "<br>")}</div></td>`
            } else {
                page += `<td   colspan="${columns[i].sectionCount}"><div class="topRow section${sectionNumber}">${columns[i].section}</div></td>`
                sectionNumber++
            }
        } else {
            //      page += `<td class="emptyCell"></td>`
        }
    }
    page += `</tr><tr><td colspan="${columns.length}" style="background-color:white; height: 5px;"></td></tr><tr>`

    sectionNumber = -1
    let lastSection = "";
    for (let i=0; i<columns.length; i++){
        if (columns[i].section) {
            lastSection = columns[i].section;
            i = columns.length
        }
    }


    for (let a = 0; a < rows; a++) {
        for (let i = 0; i < columns.length; i++) {
            if (columns[i].text[a] !== "") {
                if (i === 0) {
                    page += `<td><div class="firstColumn">${columns[i].text[a].replaceAll(" ", "<br>")}</div></td>`
                } else {
                    if (columns[i].section !== "") {
                        sectionNumber++;
                        //        console.log(sectionNumber,columns[i].section)
                        lastSection = columns[i].section
                    }
                    let sectionCode = sectionNumber
                    if (columns[i].text[a].startsWith("+")) {
                        sectionCode = "green";
                        columns[i].text[a] = columns[i].text[a].substring(1)
                    }
                    if (columns[i].text[a].startsWith("-")) {
                        sectionCode = "red";
                        columns[i].text[a] = columns[i].text[a].substring(1)
                    }
                    if (columns[i].text[a].startsWith("_")) {
                        sectionCode = "white";
                        columns[i].text[a] = columns[i].text[a].substring(1)
                    }
                    page += `<td><div class="note row${a} column${i} section${sectionCode}">${columns[i].text[a]}</div></td>`
                }
            } else {
                if (columns.section){
                    if (columns[i].section !== "") {
                        sectionNumber++;
                        lastSection = columns[i].section
                    }
                }

                page += `<td class="emptyCell"></td>`
            }
        }
        sectionNumber = -1
        page += `</tr><tr>`
    }
    page += `</tr><tr>`
    for (let i = 0; i < columns.length; i++) {
        if (columns[i].score !== "") {
            if (i === 0) {
                page += `<td ><div class="firstColumn">${columns[i].score.replaceAll(" ", "<br>")}</div></td>`
            } else {
                let printScore = "--";
                let value = -1;
                if (parseInt(columns[i].score) >= 0 && parseInt(columns[i].score) <= 6) {
                    value = parseInt(columns[i].score);
                    if (value === 6) { printScore = "&#128525;"; }
                    else if (value === 5) { printScore = "&#128512;" }
                    else if (value === 4) { printScore = "&#128578;" }
                    else if (value === 3) { printScore = "&#128528;" }
                    else if (value === 2) { printScore = "&#128577;" }
                    else if (value === 1) { printScore = "&#128542;" }
                    else { printScore = "&#128557;"; }
                }
                let pp = `<div style="font-weight:bold; font-size:28px; display: flex; flex-direction: column; justify-content: center; align-items: center;">`;
                for (let k = 1; k < 6; k++) {  //could be zero to 7 for more options
                    if (k === (6 - parseInt(columns[i].score))) {
                        pp += `<div style="margin-top:5px;margin-bottom:5px;">${printScore}</div>`;
                    } else {
                        pp += `<div  style="margin-top:5px;margin-bottom:5px; color:#cccccc">|</div>`;
                    }
                    //         console.log(6-value,k,parseInt(columns[i].score))

                }
                pp += `</div>`;


                page += `<td ><div class="numberCell">${pp}</div></td>`
            }
        } else {
            page += `<td class="emptyCell"></td>`
        }

    }
    page += `</tr><table>`

    let complete = `
        <html>
            <head>
                <title>User Journey</title>
                ${style}
            <head>
            <body>
                ${page}
            </body>
        </html>
    `

    fs.writeFileSync('chart.html', complete);

    //reformat into rows
}


getData(process.argv[2])
