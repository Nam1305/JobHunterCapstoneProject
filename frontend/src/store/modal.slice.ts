import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

type ModalType = "login" | "register" | "application" | null

export interface ApplicationModalJob {
  id?: string
  title: string
  companyName: string
}

interface ModalState {
  openModal: ModalType
  applicationJob: ApplicationModalJob | null
}

const initialState: ModalState = {
  openModal: null,
  applicationJob: null,
}

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openLoginModal: (state) => {
      state.openModal = "login"
      state.applicationJob = null
    },
    toggleLoginModal: (state) => {
      state.openModal = state.openModal === "login" ? null : "login"
      state.applicationJob = null
    },
    openRegisterModal: (state) => {
      state.openModal = "register"
      state.applicationJob = null
    },
    toggleRegisterModal: (state) => {
      state.openModal = state.openModal === "register" ? null : "register"
      state.applicationJob = null
    },
    openApplicationModal: (
      state,
      action: PayloadAction<ApplicationModalJob>
    ) => {
      state.openModal = "application"
      state.applicationJob = action.payload
    },
    closeModal: (state) => {
      state.openModal = null
      state.applicationJob = null
    },
  },
})

export const {
  openLoginModal,
  toggleLoginModal,
  openRegisterModal,
  toggleRegisterModal,
  openApplicationModal,
  closeModal,
} = modalSlice.actions
export default modalSlice.reducer
