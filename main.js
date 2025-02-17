const { crawlUrl } = require("./crawl")
const { printReport } = require("./report.js")

async function main(){
  if(process.argv.length < 3){
    console.log("website is not there")
    process.exit(1)
  }
  if(process.argv.length > 3){
    console.log("more than one url")
    process.exit(1)
  }
  const baseUrl = process.argv[2]

  console.log(`starting crawling ${baseUrl}`)
  const pages =await crawlUrl(baseUrl, baseUrl, {})
//   for(const page of Object.entries(pages)){
//     console.log(page)
//   }
printReport(pages)
}

main()