// Calculate statistics for an artist's work
export function songStatistics(work) {
    console.log('STATS')
    console.log(work)
    let min = 0
    let max = 0
    let wordCount = 0

    for (let i = 0; i < work.length; i++) {
        if (work[i] > 1) {
            // Calculate min and max words in a song
            if (work[i] < min || min === 0) {
                min = work[i]
            }
            if (work[i] > max || max === 0) {
                max = work[i]
            }
            // Calculate total words
            wordCount += work[i]
        }
    }

    // Calculate the mean
    let mean = wordCount / work.length

    // Return the stats
    return {
        'min': min,
        'max': max,
        'songCount': work.length,
        'wordCount': wordCount,
        'mean': mean
    }
}
