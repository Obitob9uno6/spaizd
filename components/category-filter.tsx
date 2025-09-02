"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

interface Category {
  id: string
  name: string
  slug: string
}

interface CategoryFilterProps {
  categories: Category[]
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, categoryId])
    } else {
      setSelectedCategories(selectedCategories.filter((id) => id !== categoryId))
    }
  }

  const clearFilters = () => {
    setSelectedCategories([])
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={category.id}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
              />
              <label
                htmlFor={category.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {category.name}
              </label>
            </div>
          ))}

          {selectedCategories.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearFilters} className="w-full mt-4 bg-transparent">
              Clear Filters
            </Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Price Range</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Checkbox id="under-50" />
              <label htmlFor="under-50" className="cursor-pointer">
                Under $50
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="50-100" />
              <label htmlFor="50-100" className="cursor-pointer">
                $50 - $100
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="over-100" />
              <label htmlFor="over-100" className="cursor-pointer">
                Over $100
              </label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
