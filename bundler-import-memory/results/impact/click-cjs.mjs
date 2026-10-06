export default async function ({page}) {
  await page.click('#cjs')
  await page.getByText('IMPACT_CJS-1', {exact: false}).waitFor()
}
