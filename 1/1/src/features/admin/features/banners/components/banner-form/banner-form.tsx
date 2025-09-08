"use client"

import { FC, useTransition } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { ChangeEventInputType } from "@/types"

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
import { Separator } from "@/components/ui/separator"

import { AppHoverDemo } from "@/components/shared/app-hover-card"
import { AppResponsiveModal } from "@/components/shared/app-responsive-modal"
import { LoadingButton } from "@/components/shared/loading-button"
import { RequiredFormLabel } from "@/components/shared/required-form-label"

import { AdminHeading } from "@/features/admin/components/shared/admin-heading"
import { SingleImageUpload } from "@/features/admin/components/shared/single-image-upload"
import { SlugInput } from "@/features/admin/components/shared/slug-input"
import { ADMIN_FORM } from "@/features/admin/constants"
import {
  type SaveBannerSchema,
  saveBannerSchema,
} from "@/features/admin/features/banners/lib/banner.schema"

import { useDelete, useSave } from "./hooks"

interface BannerFormProps {
  defaultValues: SaveBannerSchema
  isEditing: boolean
}

export const BannerForm: FC<BannerFormProps> = ({
  defaultValues,
  isEditing,
}) => {
  const { deleteExecute, isDeletePending } = useDelete()
  const { saveExecute, isSavePending } = useSave(defaultValues.slug)
  const [isDeleteImagePending, startDeleteImageTransition] = useTransition()

  const isPending = isDeletePending || isSavePending || isDeleteImagePending

  const form = useForm<SaveBannerSchema>({
    resolver: zodResolver(saveBannerSchema),
    defaultValues: {
      ...defaultValues,
      priority: defaultValues.priority && defaultValues.priority >= 1
      ? defaultValues.priority
      : 1
    },
  })

  function onSubmit(values: SaveBannerSchema) {
    saveExecute(values)
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <AdminHeading
          title={isEditing ? `Edit Banner` : "New Banner"}
          description={
            isEditing
              ? `ID: ${defaultValues.id}`
              : "Create a new product banner"
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
          className="mb-12 max-w-3xl space-y-6"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {/* Name and Slug Fields */}
          <div className="grid grid-cols-1 items-baseline gap-x-8 gap-y-6 md:grid-cols-2">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => {
                const handleChange: ChangeEventInputType = (e) => {
                  const nameInput = e.target.value
                  const generatedSlug = slugify(nameInput)
                  form.setValue("slug", generatedSlug)
                  form.trigger("slug") // for validation
                  field.onChange(nameInput)
                  form.trigger("name") // for validation
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
          </div>

          {/* Image Upload */}
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <RequiredFormLabel label="Image" />
<div>* Recommended resolution: <span className="font-medium">1800 × 600 </span></div>
                <FormControl>
                  <SingleImageUpload<SaveBannerSchema>
                    hasError={!!form.formState.errors.image}
                    field={field}
                    isDeleteImagePending={isPending}
                    startDeleteImageTransition={startDeleteImageTransition}
                    uploadRoute="banner"
                  />
                </FormControl>

                <FormMessage />
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
                    Set whether this banner is active and visible to customers
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          {/* Priority */}
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <RequiredFormLabel label="Priority" />
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Priority"
                    {...field}
                    // Convert string input to number
                    onChange={(e) => {
                      const rawValue = parseInt(e.target.value, 10)
                      const value =
                        isNaN(rawValue) || rawValue < 1 ? 1 : rawValue
                      field.onChange(value)
                    }}
                    disabled={isPending}
                  />
                </FormControl>
                <FormDescription>
                  Lower numbers appear first. Use this to control the order of
                  banners.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
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
