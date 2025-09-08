"use client"

import { FC, useTransition } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { ChangeEventInputType } from "@/types"

import { slugify } from "@/lib/utils"

import { DIALOG_TEXTS } from "@/constants"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

import { AppHoverDemo } from "@/components/shared/app-hover-card"
import { AppResponsiveModal } from "@/components/shared/app-responsive-modal"
import { LoadingButton } from "@/components/shared/loading-button"
import { RequiredFormLabel } from "@/components/shared/required-form-label"

import { AdminHeading } from "@/features/admin/components/shared/admin-heading"
import { SingleImageUpload } from "@/features/admin/components/shared/single-image-upload"
import { SlugInput } from "@/features/admin/components/shared/slug-input"
import { ADMIN_FORM } from "@/features/admin/constants"
import {
  type SaveAttributeSchema,
  saveAttributeSchema,
} from "@/features/admin/features/attributes/lib/attribute.schema"

import { useDelete, useSave } from "./hooks"

interface AttributeFormProps {
  defaultValues: SaveAttributeSchema
  isEditing: boolean
}

export const AttributeForm: FC<AttributeFormProps> = ({
  defaultValues,
  isEditing,
}) => {
  const { deleteExecute, isDeletePending } = useDelete()
  const { saveExecute, isSavePending } = useSave(defaultValues.slug)
  const [isDeleteImagePending, startDeleteImageTransition] = useTransition()

  const isPending = isDeletePending || isSavePending || isDeleteImagePending

  const form = useForm<SaveAttributeSchema>({
    resolver: zodResolver(saveAttributeSchema),
    defaultValues,
  })

  function onSubmit(values: SaveAttributeSchema) {
    saveExecute(values)
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <AdminHeading
          title={isEditing ? `Edit Attribute` : "New Attribute"}
          description={
            isEditing
              ? `ID: ${defaultValues.id}`
              : "Create a new product attribute"
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
          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Description"
                    className="max-h-56 min-h-24 resize-none overflow-y-auto"
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Image Upload */}
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <RequiredFormLabel label="Image" />

                <FormControl>
                  <SingleImageUpload<SaveAttributeSchema>
                    hasError={!!form.formState.errors.image}
                    field={field}
                    isDeleteImagePending={isPending}
                    startDeleteImageTransition={startDeleteImageTransition}
                    uploadRoute="attribute"
                  />
                </FormControl>

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
