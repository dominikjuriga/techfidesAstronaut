import React, { useState } from 'react'
import s from "../styles/Modal.module.css"

interface IProps {
  children?: React.ReactNode,
  title: string,
  closeModal: () => void
}

const Modal: React.FC<IProps> = ({ title, closeModal, children }) => {

  return (
    <div className={`${s.modal}`}>
      <div className={s.backdrop} title={`Close Modal`} onClick={() => closeModal()}></div>
      <div className={s.content}>
        <h4>{title}</h4>
        <hr />
        {children}
        <button onClick={closeModal}>Close</button>
      </div>
    </div>
  )
}

export default Modal