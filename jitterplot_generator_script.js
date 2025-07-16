function createBoxplot() {
    console.log("createBoxplot() called");
    // Get values from input fields
    var plotTitle = document.getElementById("plotTitle").value;
    console.log("plotTitle:", plotTitle);
    var numbers = document.getElementById("numbers").value;
    console.log("numbers:", numbers);
    var maxValue = parseFloat(document.getElementById("maxValue").value);
    console.log("maxValue:", maxValue);
    var minValue = parseFloat(document.getElementById("minValue").value);
    console.log("minValue:", minValue);
    var barValue = parseFloat(document.getElementById("barValue").value);
    console.log("barValue:", barValue);
    // Data validation: Plot title cannot be empty
    if (plotTitle.trim() === "") {
        alert("Plot title cannot be empty.");
        return;
    }

    // Parse comma-separated numbers into an array of numbers
    var numbersArray = numbers.split(/[\s,\n\t]+/).map(parseFloat);
    console.log("numbersArray:", numbersArray);

    // Handle potential errors during parsing
    if (numbersArray.some(isNaN)) {
        alert("Please enter valid numbers separated by commas, tabs, or spaces.");
        return;
    }

    // Basic data for the boxplot
    var data = [{
        y: numbersArray,
        type: 'box',
        name: 'Scores',
        // visible: 'legendonly',
        boxpoints: 'all',
        jitter: 0.2,
        pointpos: 2,
        whiskerwidth: 0.5,
        marker: {
            size: 12,
            opacity: 0.5
        }
    }];

    // Calculate statistics
    var mean = numbersArray.reduce((a, b) => a + b, 0) / numbersArray.length;
    var lowest = Math.min(...numbersArray);
    var highest = Math.max(...numbersArray);
    var count = calculateCount(numbersArray);
    var stdDev = calculateStandardDeviation(numbersArray);

    // Calculate quartiles
    numbersArray.sort((a, b) => a - b);
    var q1 = calculateQuartile(numbersArray, 0.25);
    var median = calculateQuartile(numbersArray, 0.5);
    var q3 = calculateQuartile(numbersArray, 0.75);



    // Add a horizontal line representing the "Bar Value"
    var shapes = [{
        type: 'line',
        x0: 0,
        x1: 0.55,
        y0: barValue,
        y1: barValue,
        xref: 'paper',
        yref: 'y',
        line: {
            width: 1,
            color: 'red'
        }},
        { // Median
        type: 'line',
        x0: 0.20,
        x1: 0.50,
        y0: median,
        y1: median,
        xref: 'paper',
        yref: 'y',
        line: {
            width: 2,
            color: 'blue'}
        },
        { // Q3
        type: 'line',
        x0: 0.25,
        x1: 0.45,
        y0: q3,
        y1: q3,
        xref: 'paper',
        yref: 'y',
        line: {
            width: 1,
            color: 'blue'}},
        { // Q1
        type: 'line',
        x0: 0.25,
        x1: 0.45,
        y0: q1,
        y1: q1,
        xref: 'paper',
        yref: 'y',
        line: {
            width: 1,
            color: 'blue'}}
    ];

    // Layout configuration
    var layout = {
        autosize: false,
        width: 450,
        height:600,
        title: {
          text:plotTitle,
          font: {
            size: 24
          },
          xref: 'paper',
          x: 0.5,
        },
        yaxis: {
            range: [minValue, maxValue]
        },
        xaxis: {
            range: [0.35,0.75] // we're gonna hide the boxplot
        },
        shapes: shapes // Add the horizontal line to the layout
        
    };

    // Display statistics using Plotly annotations
    var annotations = [
        {
            x: 0.05,
            y: barValue + 1,
            xref: 'paper',
            yref: 'y',
            text: 'Passing',
            showarrow: false,
            xanchor: 'left',
            align: 'left',
            // yanchor: 'top'
        },
        {
            x: 0.05,
            y: q3,
            xref: 'paper',
            yref: 'y',
            text: 'Q3',
            showarrow: false,
            xanchor: 'left',
            align: 'left',
            // yanchor: 'top'
        },
        {
            x: 0.05,
            y: q1,
            xref: 'paper',
            yref: 'y',
            text: 'Q1',
            showarrow: false,
            xanchor: 'left',
            align: 'left',
            // yanchor: 'top'
        },
        {
            x: 0.75,
            y: maxValue,
            xref: 'paper',
            yref: 'y',
            text: 'Max: ' + highest + '<br>Q3: ' + q3.toFixed(2) + '<br>Median: ' + median.toFixed(2) + '<br>Mean: ' + mean.toFixed(2) + 
                '<br>Q1: ' + q1.toFixed(2) + '<br>Min: ' + lowest + '<br>Count: ' + count + '<br>sd: ' + stdDev.toFixed(2),
            showarrow: false,
            xanchor: 'left',
            align: 'left',
            yanchor: 'top'
        }
    ];

    layout.annotations = annotations;

    // Render the plot
    Plotly.newPlot('boxplot', data, layout);
    console.log("Plotly.newPlot() called");
}

function calculateCount(arr) {
    return arr.length;
}

function calculateStandardDeviation(arr) {
    const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
    return Math.sqrt(arr.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / arr.length);
}

// Helper function to calculate quartiles
function calculateQuartile(arr, percentile) {
    const index = percentile * (arr.length - 1);
    if (Math.floor(index) === index) {
        return arr[index];
    }
    const i = Math.floor(index);
    const fraction = index - i;
    return arr[i] + (arr[i + 1] - arr[i]) * fraction;
}