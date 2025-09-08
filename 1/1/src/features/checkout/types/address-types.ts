/**
 * Address Types
 * Types for address management in the checkout flow
 */

/**
 * Address interface for user addresses
 */
export interface Address {
  id: string
  name: string // e.g., "Home", "Office", "Mom's House"
  address: string
  city: string
  postalCode: string
  isDefault?: boolean
  createdAt: string
  updatedAt: string
}

/**
 * Address form data for creating/editing addresses
 */
export interface AddressFormData {
  name: string
  address: string
  city: string
  postalCode: string
  isDefault?: boolean
}

/**
 * Address selection data for checkout
 */
export interface AddressSelectionData {
  addressId: string | null // null means "add new address"
  customAddress?: AddressFormData // used when adding new address
}

/**
 * Address management actions
 */
export interface AddressManagementActions {
  onSelectAddress: (addressId: string) => void
  onAddNewAddress: () => void
  onEditAddress: (address: Address) => void
  onDeleteAddress: (addressId: string) => void
  onSetDefaultAddress: (addressId: string) => void
}
