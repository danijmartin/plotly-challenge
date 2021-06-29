// Read in data file
d3.json("/data/samples.json").then(function(data) {
        
    // Grab values for dropdown
    var ids = data.names;

    // Populate drop down
    var counter = 0;
    ids.forEach(function(id) {
    d3.select("#selDataset").append("option").attr("value", `${counter}`).text(id);
    counter +=1;
    })
});



d3.select("#selDataset").on("change", updatePlots);

function updatePlots() {
    var selection = d3.select("selDataset").node().value;
    console.log(selection);

    d3.json("/data/samples.json").then(function(data) {
        var sample_id = data.samples.id;
        var sample_values = data.samples.sample_values;
        var otu_ids = data.samples.otu_ids;
        var otu_labels = data.samples.otu_labels;
        var metadata = data.metadata;

    barChart();
    bubbleChart();
    demographics();
    guageChart();
    });
};

function barChart() {
    var data = [{
        type: "bar",
        orientation: "h",
        x: sample_values,
        y: otu_ids,
        text: otu_labels
    }]

    Plotly.newPlot("bar", data);
};

function bubbleChart() {
    var data = [{
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
            color: otu_ids,
            size: sample_values
        }
    }];

    Plotly.newPlot("bubble", data);
};