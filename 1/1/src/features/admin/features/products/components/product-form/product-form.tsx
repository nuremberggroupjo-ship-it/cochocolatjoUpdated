"use client"

import { FC, useTransition } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { ChangeEventInputType } from "@/types"

import { Attribute, Category } from "@/lib/_generated/prisma"
import { slugify } from "@/lib/utils"

import { DIALOG_TEXTS } from "@/constants"

import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

import { AppHoverDemo } from "@/components/shared/app-hover-card"
import { AppResponsiveModal } from "@/components/shared/app-responsive-modal"
import { LoadingButton } from "@/components/shared/loading-button"
import { RequiredFormLabel } from "@/components/shared/required-form-label"

import { AdminHeading } from "@/features/admin/components/shared/admin-heading"
import { RichTextEditor } from "@/features/admin/components/shared/rich-text-editor"
import { SlugInput } from "@/features/admin/components/shared/slug-input"
import { ADMIN_FORM } from "@/features/admin/constants"
import {
  type SaveProductSchema,
  saveProductSchema,
} from "@/features/admin/features/products/lib/product.schema"

import { AttributeSelector, ProductImagesUpload } from "./components"
import { useDelete, useSave } from "./hooks"

interface ProductFormProps {
  defaultValues: SaveProductSchema
  isEditing: boolean
  categories: Category[]
  attributes: Attribute[]
}

export const ProductForm: FC<ProductFormProps> = ({
  defaultValues,
  isEditing,
  categories,
  attributes,
}) => {
  const { deleteExecute, isDeletePending } = useDelete()
  const { saveExecute, isSavePending } = useSave(defaultValues.slug)
  const [isRemoveImagePending, startRemoveImageTransition] = useTransition()

  const isPending = isDeletePending || isSavePending || isRemoveImagePending

  const form = useForm<SaveProductSchema>({
    resolver: zodResolver(saveProductSchema),
    defaultValues,
  })

  function onSubmit(values: SaveProductSchema) {
    saveExecute(values)
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <AdminHeading
          title={isEditing ? `Edit Product` : "New Product"}
          description={
            isEditing
              ? `ID: ${defaultValues.id}`
              : "Create a new product product"
          }
        />
        {isEditing && defaultValues.id && (
          <AppResponsiveModal
            onAction={() => deleteExecute({ id: defaultValues.id as string })}
            isActionLoading={isPending}
            description={DIALOG_TEXTS.DELETE_CONFIRMATION.DESCRIPTION(
              defaultValues.name,
            )}
            isDescriptionHtml
          />
        )}
      </div>
      <Separator />

      <Form {...form}>
        <form
          className="mb-12 max-w-full space-y-8"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-1 items-start gap-6 text-base md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => {
                const handleChange: ChangeEventInputType = (e) => {
                  const nameInput = e.target.value
                  const generatedSlug = slugify(nameInput)
                  form.setValue("slug", generatedSlug)
                  form.trigger("slug")
                  field.onChange(nameInput)
                  form.trigger("name")
                }
                return (
                  <FormItem>
                    <RequiredFormLabel label="Name" />
                    <FormControl>
                      <Input
                        placeholder="Name"
                        {...field}
                        onChange={handleChange}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />

            {/* Slug */}
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <div className="inline-flex items-center gap-x-2">
                    <RequiredFormLabel label="Slug" />
                    <AppHoverDemo>{ADMIN_FORM.DESCRIPTIONS.SLUG}</AppHoverDemo>
                  </div>
                  <FormControl>
                    <SlugInput
                      value={field.value}
                      hasError={!!form.formState.errors.slug}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

           <div className="inline-flex gap-x-4 w-full">
  {/* Size field (optional) */}
  <FormField
    control={form.control}
    name="size"
    render={({ field }) => (
      <FormItem className="flex-1">
        <FormLabel className="cursor-pointer">Size (optional)</FormLabel>
        <FormControl>
          <Input
            placeholder="Size"
            {...field}
            disabled={isPending}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />

  {/* Unit field (optional) */}
  <FormField
    control={form.control}
    name="unit"
    render={({ field }) => (
      <FormItem className="flex-1">
        <FormLabel className="cursor-pointer">Unit (optional)</FormLabel>
        <FormControl>
          <Select
            onValueChange={(value) => {
              // Treat "enter" as empty
              field.onChange(value === "enter" ? "" : value);
            }}
            defaultValue="enter"
          >
            <SelectTrigger className="w-full" disabled={isPending}>
              <SelectValue placeholder="Please select a unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="enter">Please select a unit</SelectItem>
              <SelectItem value="Pcs">Pcs</SelectItem>
              <SelectItem value="g">g</SelectItem>
              <SelectItem value="ml">ml</SelectItem>
            </SelectContent>
          </Select>
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
</div>


            {/* Category */}
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <RequiredFormLabel label="Category" />
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Price */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <RequiredFormLabel label="Price" />
                  <FormControl>
                    <Input
                      placeholder="Price"
                      type="number"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* isDiscountActive */}
            <FormField
              control={form.control}
              name="isDiscountActive"
              render={({ field }) => (
                <FormItem className="flex items-start space-y-0 space-x-3 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isPending}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="inline-block cursor-pointer">
                      Discount
                    </FormLabel>
                    <FormDescription>
                      Set whether this product is on discount
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {/* Discount Price - Only show when enabled */}
            {form.watch("isDiscountActive") && (
              <FormField
                control={form.control}
                name="discountPrice"
                render={({ field }) => (
                  <FormItem>
                    <RequiredFormLabel label="Discount Price" />
                    <FormControl>
                      <Input
                        placeholder="Discount Price"
                        type="number"
                        step="0.01"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => {
                          const value = e.target.value
                          field.onChange(
                            value === "" ? null : parseFloat(value),
                          )
                        }}
                        disabled={isPending}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {!form.watch("isDiscountActive") && (
              <div className="col-span-1 hidden sm:block"></div>
            )}
            {/* Stock */}
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <RequiredFormLabel label="Stock" />
                  <FormControl>
                    <Input
                      placeholder="Stock"
                      type="number"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Attributes */}
            <FormField
              control={form.control}
              name="attributes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attributes</FormLabel>
                  <FormControl>
                    <AttributeSelector attributes={attributes} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="hidden lg:col-span-1 lg:block"></div>

            {/* Short Description */}
            <FormField
              control={form.control}
              name="shortDescription"
              render={({ field }) => (
                <FormItem>
                  <div className="inline-flex items-center gap-x-2">
                    <RequiredFormLabel label="Short Description" />
                    <AppHoverDemo>
                      {ADMIN_FORM.DESCRIPTIONS.SHORT_DESCRIPTION}
                    </AppHoverDemo>
                  </div>
                  <FormControl>
                    <Textarea
                      placeholder="Short Description"
                      className="max-h-56 min-h-24 resize-none overflow-y-auto"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Ingredients */}
            <FormField
              control={form.control}
              name="ingredients"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ingredients</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ingredients"
                      className="max-h-56 min-h-24 resize-none overflow-y-auto"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="col-span-1 md:col-span-2">
                  <RequiredFormLabel label="Description" />
                  <FormControl>
                    <RichTextEditor
                      hasError={!!form.formState.errors.description}
                      placeholder="Description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Images */}
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem className="col-span-1 md:col-span-2">
              
                  <RequiredFormLabel label="Images" />
                      <div>* Recommended resolution: <span className="font-medium">1500 × 1000 </span></div>
                  <FormControl>
                    
                    <ProductImagesUpload
                      hasError={!!form.formState.errors.images}
                      isRemoveImagePending={isRemoveImagePending}
                      startRemoveImageTransition={startRemoveImageTransition}
                      {...field}
                    />
                    
                  </FormControl>
                     
                  <FormMessage />
               
                </FormItem>
              )}
            />
            <div className="hidden lg:col-span-1 lg:block"></div>
            {/* Featured Status */}
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex items-start space-y-0 space-x-3 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isPending}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="inline-block cursor-pointer">
                      Featured
                    </FormLabel>
                    <FormDescription>
                      Set whether this product is featured on the home page
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            {/* Active Status */}
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-start space-y-0 space-x-3 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isPending}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="inline-block cursor-pointer">
                      Active
                    </FormLabel>
                    <FormDescription>
                      Set whether this product is active and visible to
                      customers
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
          {/* Submit Button */}
          <div>
            <LoadingButton isLoading={isPending}>
              {isEditing ? ADMIN_FORM.BUTTON.EDIT : ADMIN_FORM.BUTTON.ADD}
            </LoadingButton>
          </div>
        </form>
      </Form>
    </>
  )
}
