import { Polar } from 'react-chartjs-2'

// Render Polar Chart
export function topSongsByWordCount(work) {
    let labels = []
    let values = []
    // Get the top 10 songs in terms of word count
    let sortedWork = work.sort((a, b) => b.wordCount - a.wordCount);
    sortedWork.slice(0, 10);
    for (let i = 0; i < sortedWork.length; i++) {
      if (i < 10) {
        labels.push(sortedWork[i].name + ' (' + sortedWork[i].wordCount + ')')
        values.push(sortedWork[i].wordCount)
      }
    }
  
    let data= {
      labels: labels,
      datasets: [
        {
          label: 'Top ' + sortedWork.length + ' Songs by Word Count',
          data: values,
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(79, 159, 64, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(99, 28, 175, 0.5)',
            'rgba(200, 150, 132, 0.5)',
          ],
          borderWidth: 1,
        },
      ]
    }
  
    return <Polar data={data}/>
  }
  