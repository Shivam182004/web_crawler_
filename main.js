const { crawlUrl } = require("./crawl")

function main(){
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
  crawlUrl(baseUrl)
}

main()