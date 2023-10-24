import Head from "next/head"
import Link from "next/link"
import Report from '../components/Report'
import { Result } from '../types'

const outputs = '../pipeline/outputs'

export async function getStaticProps({ params }: any) {
  const report = process.env.REPORT
  if (report && report.length) {
    const fs = require('fs');
    const result = fs.readFileSync(`../pipeline/outputs/${report}/result.json`, 'utf8');
    return { props: { result: JSON.parse(result) } }
  }
  const fs = require('fs');
  const subfolders = fs.readdirSync(outputs, { withFileTypes: true })
    .map((x: any) => x.name)
    .filter((x: string) => !x.startsWith('.'));
  return { props: { subfolders } };
}

export default function Home({ subfolders, result }: { subfolders?: string[], result?: Result }) {
  if (result) {
    return <Report {...result} />
  } else {
    return (
      <>
        <div className="flex flex-col h-screen p-4">
          <h1 className="text-xl mb-4">Available reports:</h1>
          {subfolders!.map((name: string) =>
            <Link className="my-2 p-2 border block hover:bg-gray-300" key={name} href={`/report/${name}`}>{name}</Link>
          )}
        </div>
      </>
    )
  }
}