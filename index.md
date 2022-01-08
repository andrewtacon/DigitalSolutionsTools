<html>

<head>
    <title>
        Journey Mapper
    </title>
    <script src="jmweb.js"></script>
    <style>
        html, body, h3 {
            margin: 0px;
            padding: 0px;
        }

        p  {
            margin:0px;
            padding: 0px;
        }

        h3 {
            width: calc(100%-2px) ;
            background-color: aquamarine;
            padding: 5px 0px 5px 0px;
            border: 1px solid black;
            display:flex;
            flex-direction: row;
            justify-content: space-between;
            padding: 5px 5px 5px 5px;
        }

        textarea {
            margin: 0px;
            padding: 5px;
            border: 1px solid black;
        }

        body {
            display: flex;
            flex-direction: row;
            height: 100%;
        }

        #main {
            display: flex;
            flex-direction: column;
            width: 40%;
            padding: 5px;
        }

        #bottom {
            border: 1px solid black;
            padding: 5px;
            margin: 0px;
        }
    </style>

</head>

<body onload="addListener()">
    <div id="main">
        <h3>Journey Map Maker</h3>
        <textarea id="textarea" style="flex-grow:1;resize: none;">
title My Holiday Day
subtitle User Journey for Marcus & Theodore
section Phases
    Customer Actions, Customer Thoughts,Customer Feeling: Customer Experience
section Go to work
    Make tea, Be happy<br>Very HAPPY!, +do stuff: 1
    Go upstairs, be around: 2
    Do work: 3
section Go home
    Go downstairs, _Be white, -Be red: 4
    Sit down,,+Be green: 5
section Go to bed
    Go upstairs,, +Happy: 4
    Lie down,,+Be green: 5
            
        </textarea>
        <h3>Syntax<button onclick='loadFull()'>Load Full Screen</button></h3>
        <div id="bottom">
          
            
        
            <p>title => print title at top of screen</p>
            <p>subtitle => adds subtitle</p>
            <p>section => starts a new section group.
                <ul>
                    <li>First section will be first column formatted as headings.</li>
            <li>section content is single line per column. 
                    <li>Line entries separared by commas.</li>
                    <li>Line entries follow section colour unless:
                        <ul>
                            <li>+ at start --> makes cell green</li>
                            <li>- at start --> makes cell red</li>
                            <li>_ at start --> makes cell white</li>
                        </ul>
                    </li>
                    <li>The colon separates out the number for the ranking at the bottom of the chart.</li>
                    <li>The colon is required when detailing the headings also.</li>
                    <li>Score shoud be a value 1 to 5 inclusive.</li>
                </ul></p>
        </div>
    </div>

    
    <iframe id="target" style="flex-grow:1"></iframe>

</body>

</html>
