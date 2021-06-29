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
        var wfreq = metadata.wfreq
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
        text: topOtu_labels,
        marker: {color: ["#EAF2F8", "#D4E6F1", "#A9CCE3", "#7FB3D5", "#5499C7", "#2980B9", "#2471A3", "#1F618D", "#1A5276", "#154360"]}
        }]

        var layout = {
            title: {text: "Top 10 Bacteria Cultures Found", font: {size: 20}},
            xaxis: {title: "Total in Sample"}
        }

        Plotly.newPlot("bar", data, layout);

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
            title: {text: "Bacteria Cultures per sample", font: {size: 24}},
            xaxis: {title: "OTU id"}
        }
    
        Plotly.newPlot("bubble", data, layout);

        // Demographics
        // console.log(metadata) - code verification
        Object.entries(metadata).forEach(([key,value]) =>
            d3.select("#sample-metadata").append("p").attr("style", "font-weight: bold").text(`${key}: ${value}`));

        //Gauge Chart
        var data = [
            {
              type: "indicator",
              mode: "gauge",
              value: wfreq,
              title: {text: "Scrubs per Week", font: {size: 24}},
              gauge: {
                axis: { 
                    range: [0, 9], 
                    tickmode: "linear",
                    tick0: 0,
                    dtick: 1,
                    tickwidth: 2
                },
                bar: { color: "#D2B4DE"},
                borderwidth: 2,
                bordercolor: "gray",
                steps: [
                  {range: [0, 1], color: "#E8F6F3"},
                  {range: [1, 2], color: "#D0ECE7"},
                  {range: [2, 3], color: "#A2D9CE"},
                  {range: [3, 4], color: "#73C6B6"},
                  {range: [4, 5], color: "#45B39D"},
                  {range: [5, 6], color: "#16A085"},
                  {range: [6, 7], color: "#138D75"},
                  {range: [7, 8], color: "#117A65"},
                  {range: [8, 9], color: "#0E6655"}
                ]
              }
            }
          ];
          
          Plotly.newPlot("gauge", data);
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
        var wfreq = metadata.wfreq
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

        // Restyle Gauge Chart
        Plotly.restyle("gauge", "value", [wfreq]);

    });  
};

init();