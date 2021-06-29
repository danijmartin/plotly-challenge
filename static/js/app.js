function init() {
    // Read in data file
    d3.json("/data/samples.json").then(function(data) {
        // Grab values for dropdown and default charts
        var ids = data.names;
        var sample = data.samples[0];
        var sample_values = sample.sample_values;
        var otu_ids = sample.otu_ids;
        var otu_labels = sample.otu_labels;
        var metadata = data.metadata[0];
        // console.log(otu_ids); - code verification

        // Populate drop down
        var counter = 0;
        ids.forEach(function(id) {
        d3.select("#selDataset").append("option").attr("value", `${counter}`).text(id);
        counter +=1;
        })

        // Bar graph
        // Limit data to top 10 and reverse order
        let topS_values = sample_values.slice(0,10).reverse();
        let topOtu_ids = otu_ids.slice(0,10).reverse();
        let topOtu_labels = otu_labels.slice(0,10).reverse();
        // console.log(topOtu_labels) - code verification

        // Add OTU to OTU ids
        let stringOtu_ids = []
        topOtu_ids.forEach(function(num) {
            stringOtu_ids.push(`OTU ${num}`);
        });
        // console.log(stringOtu_ids); code verification

        // Build bar graph
        var data = [{
        type: "bar",
        orientation: "h",
        x: topS_values,
        y: stringOtu_ids,
        text: topOtu_labels
        }]

        Plotly.newPlot("bar", data);

        //Bubble Chart
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

        var layout = {
            xaxis: {
                title: "OTU id"
            }
        }
    
        Plotly.newPlot("bubble", data, layout);

        // Demographics
        // console.log(metadata) - code verification
        Object.entries(metadata).forEach(([key,value]) =>
            d3.select("#sample-metadata").append("p").attr("style", "font-weight: bold").text(`${key}: ${value}`));
    });
};


//Build event listener
function optionChanged() {
    // Assign value to variable (value is id's index inside samples list)
    var selection = d3.select("#selDataset").property("value");
    console.log(selection);

    // Read in data file again
    d3.json("/data/samples.json").then(function(data) {
        // Grab values for updated charts
        var sample = data.samples[`${selection}`];
        var sample_values = sample.sample_values;
        var otu_ids = sample.otu_ids;
        var otu_labels = sample.otu_labels;
        var metadata = data.metadata[`${selection}`];
        console.log(sample);

        // Rebuild Bar chart data
        // Limit data to top 10 and reverse order
        let topS_values = sample_values.slice(0,10).reverse();
        let topOtu_ids = otu_ids.slice(0,10).reverse();
        let topOtu_labels = otu_labels.slice(0,10).reverse();

        // Add OTU to OTU ids
        let stringOtu_ids = []
        topOtu_ids.forEach(function(num) {
            stringOtu_ids.push(`OTU ${num}`);
        });

        // Restyle bar chart
        Plotly.restyle("bar", "x", [topS_values]);
        Plotly.restyle("bar", "y", [stringOtu_ids]);
        Plotly.restyle("bar", "text", [topOtu_labels]);

        //Restyle Bubble Chart
        Plotly.restyle("bubble", "x", [otu_ids]);
        Plotly.restyle("bubble", "y", [sample_values]);
        Plotly.restyle("bubble", "text", [otu_labels]);
        Plotly.restyle("bubble", "marker.color", [otu_ids]);
        Plotly.restyle("bubble", "marker.size", [sample_values]);

        // Update Demographics
        //Clear previous data
        d3.select("#sample-metadata").selectAll("p").remove();

        // Add new data
        Object.entries(metadata).forEach(([key,value]) =>
            d3.select("#sample-metadata").append("p").attr("style", "font-weight: bold").text(`${key}: ${value}`));

    });

    
};

init();