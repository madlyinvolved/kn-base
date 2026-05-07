import { getActiveDiscounts } from '../../../lib/data/queries.js'
import DiscountsClient from './DiscountsClient.jsx'

export const metadata = { title: 'Корпоративные скидки — AdCorp' }

export default async function DiscountsPage() {
  const discounts = await getActiveDiscounts()
  return <DiscountsClient discounts={discounts} />
}
