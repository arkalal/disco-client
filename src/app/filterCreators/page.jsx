"use client"

import { Suspense } from 'react'
import FilterCreatorsUI from "../../../components/filterCreators/FilterCreatorsUI"

export default function FilterCreators() {
  return (
    <div className="filter-creators-page">
      <Suspense fallback={<div>Loading...</div>}>
        <FilterCreatorsUI />
      </Suspense>
    </div>
  )
}
