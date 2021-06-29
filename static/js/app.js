function init() {
// Read in data file
    d3.json("/data/samples.json").then(function(data) {
            
        // Grab values for dropdown
        var ids = data.names;
        var sample_id = data.samples.id;
        var sample_values = data.samples.sample_values;
        var otu_ids = data.samples.otu_ids;
        var otu_labels = data.samples.otu_labels;
        var metadata = data.metadata;

        console.log(ids);

        // Populate drop down
        ids.forEach(function(id) {
            d3.select("#selDataset").append("option").attr("value", `${id}`).text(id);
        })
    });
};

init()