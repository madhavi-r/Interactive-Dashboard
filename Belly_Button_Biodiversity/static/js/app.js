function buildMetadata(sample) {

  // The following function builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then(function(data){
    // Use d3 to select the panel with id of `#sample-metadata`
    var metaDataSample = d3.select("#sample-metadata");
    
    // Use `.html("") to clear any existing metadata
    metaDataSample.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Inside the loop, use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(data).forEach(([key, value])=>{
      metaDataSample
        .append("h6").text(`${key}: ${value}`);
    });
    
    // Build the Gauge Chart
    buildGauge(data.WFREQ);
  });
}

function buildCharts(sample) {

  // Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(function(data){
    // Build a Bubble Chart using the sample data
    // var sampleData = data;
    // console.log(sampleData);

    var sample_values = data.sample_values;
    var otu_ids = data.otu_ids;
    var otu_labels = data.otu_labels;

    var bubble_data = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Earth"
      } 
    }]
    var bubble_layout = [{
      hovermode: "closest",
      xaxis: {
        title: "OTU ID",
        size: 18
      }
    }]

    Plotly.newPlot("bubble", bubble_data, bubble_layout);
    // Build a Pie Chart
    // Use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

    var pie_data = [{
      labels : otu_ids.slice(0,10),
      values : sample_values.slice(0,10),
      hovertext : otu_labels.slice(0,10),
      type: "pie"  
    }]

    var pie_layout = {
      height: 500,
      width: 500,
    }
    Plotly.newPlot("pie", pie_data, pie_layout);

  });    
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
