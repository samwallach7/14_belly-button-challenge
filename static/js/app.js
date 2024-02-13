const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

d3.json(url).then(function(data) {

    var names = data.names;
    var samples = data.samples;
    var metadata = data.metadata;

    console.log(samples);

    // Populate the dropdown menu with sample IDs
    var dropdown = document.getElementById("selDataset");
    samples.forEach(function(sample) {
        var option = document.createElement("option");
        option.value = sample.id;
        option.text = sample.id;
        dropdown.appendChild(option);
    });

    // Function to update bar chart based on selected ID
    function updateBarChart(selectedID) {
        var selectedSample = samples.find(function(sample) {
            return sample.id === selectedID;
        });

        // Creating the bar chart
        var otuIds = selectedSample.otu_ids.slice(0,10);
        var otuLabels = selectedSample.otu_labels.slice(0,10);
        var sampleValues = selectedSample.sample_values.slice(0,10);
 
        // Combine data into an array of objects
        var data = [];
        for (var i = 0; i < otuIds.length; i++) {
            data.push({
                otu_id: otuIds[i],
                otu_label: otuLabels[i],
                sample_value: sampleValues[i]
            });
        }

        // Sort data by sample value in descending order
        data.sort(function(a, b) {
            return b.sample_value - a.sample_value;
        });

        // Reverse the order of the sorted data
        data.reverse();
        
        var trace1 = {
            x: data.map(d => d.sample_value),
            y: data.map(d => `OTU ${d.otu_id}`),
            type: 'bar',
            orientation: 'h',
            text: data.map(d => d.otu_label),
            hoverinfo: 'text+x'
        };

        var layout = {
            title: 'Sample Value Counts by OTU IDs',
            xaxis: {
                title: 'Sample Values'
            },
            yaxis: {
                title: 'OTU ID'
            }
        };

        var data = [trace1];

        Plotly.newPlot('bar', data, layout);

    }

   // Function to update bubble chart based on selected ID
   function updateBubbleChart(selectedID) {
        // Filter the sample data based on the selected ID
        var selectedSample = samples.find(function(sample) {
            return sample.id === selectedID;
        });

        var trace2 = {
            x: selectedSample.otu_ids,
            y: selectedSample.sample_values,
            text: selectedSample.otu_labels,
            mode: 'markers',
            marker: {
                size: selectedSample.sample_values,
                color: selectedSample.otu_ids,
                colorscale: 'Earth'
            }
        };

        var layout = {
            title: 'OTU ID Sample Values by Size',
            xaxis: {
                title: 'OTU ID'
            },
            yaxis: {
                title: 'Sample Value'
            }
        };

        var data = [trace2];

        Plotly.newPlot('bubble', data, layout);
    } 

    // Function to update metadata panel based on selected ID
    function updateMetadataPanel(selectedID) {
        // Filter the metadata based on the selected ID
        var selectedMetadata = metadata.find(function(data) {
            return data.id == selectedID;
        });

        // Clear previous metadata
        var metadataPanel = document.getElementById("sample-metadata");
        metadataPanel.innerHTML = "";

        // Update metadata panel with the selected metadata
        Object.entries(selectedMetadata).forEach(([key, value]) => {
            var metadataEntry = document.createElement("p");
            metadataEntry.textContent = `${key}: ${value}`;
            metadataPanel.appendChild(metadataEntry);
        });
    }

    // Function to update gauge chart based on selected ID
    function updateGaugeChart(selectedID) {
        // Filter the metadata based on the selected ID
        var selectedMetadata = metadata.find(function(data) {
            return data.id == selectedID;
        });

        // Get the wfreq value from the selected metadata
        var wfreq = selectedMetadata.wfreq;

        // Create the gauge chart
        var data = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: wfreq,
                title: { text: "Belly Button Washing Frequency<br>Scrubs per Week" },
                type: "indicator",
                mode: "gauge+number",
                gauge: {
                    axis: { range: [null, 9], tickwidth: 1, tickcolor: "darkblue" },
                    bar: { color: "darkblue" },
                    bgcolor: "white",
                    borderwidth: 2,
                    bordercolor: "gray",
                    steps: [
                        { range: [0, 1], color: "#e6f2ff" },
                        { range: [1, 2], color: "#cce0ff" },
                        { range: [2, 3], color: "#b3d9ff" },
                        { range: [3, 4], color: "#99ccff" },
                        { range: [4, 5], color: "#80bfff" },
                        { range: [5, 6], color: "#66b3ff" },
                        { range: [6, 7], color: "#4da6ff" },
                        { range: [7, 8], color: "#3399ff" },
                        { range: [8, 9], color: "#1a90ff" }
                    ],
                }
            }
        ];

        var layout = { width: 600, height: 450, margin: { t: 0, b: 0 } };
        Plotly.newPlot('gauge', data, layout);
    }

    // Initial visualizations update with the first ID in the dropdown
    var firstID = samples[0].id;
    updateBarChart(firstID);
    updateBubbleChart(firstID);
    updateMetadataPanel(firstID);
    updateGaugeChart(firstID);

    // Event listener for dropdown change
    dropdown.addEventListener("change", function() {
        var selectedID = this.value;
        updateBarChart(selectedID);
        updateBubbleChart(selectedID);
        updateMetadataPanel(selectedID);
        updateGaugeChart(selectedID);
    });

}).catch(function(error) {
console.error("Error fetching data: ", error);
});