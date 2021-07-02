import React, { useEffect } from "react"
import Predictions from "@aws-amplify/predictions"
import EasyEdit, {Types} from 'react-easy-edit';

export const Text = ({ page, setPage }) => {
  const save = (value) => {
    if (value === page.text.fullText) { return null }
    getTranslation(value)
  }

  const getTranslation = (value) => {
    // console.log(value)
    setPage(page => ({
      ...page,
      message: "Translating..."
    }))
    Predictions.convert({
      translateText: {
        source: {
          text: value,
          language : page.language
        },
        targetLanguage: "en"
      }
    })
    .then(result => {
      setPage(page => ({
          ...page,
          saved: false,
          message: "Save Edits?",
          text: {
            ...page.text,
            fullText: value,
            fullTranslation: result.text
          }
      }))
    })
    .catch(err => console.log({ err }));
  }

  useEffect(() => {
    if (page.text?.fullText && page.language &&!page.text?.fullTranslation) {
      console.log('translating')
      getTranslation(page.text.fullText)
    }
  }, [page.text?.fullText, page.language])

  return (
    <div className="text p-3 sm:p-4 flex bg-gray-400 gap-x-3 sm:gap-x-5 overflow-y-hidden overflow-y-scroll">
      <EasyEdit
        type={Types.TEXTAREA}
        value={page.text?.fullText ? page.text.fullText : 'Extracted Text Goes Here'}
        buttonsPosition="before"
        hideSaveButton={true}
        hideCancelButton={true}
        saveOnBlur={true}
        onSave={save} />
      <div>{page.text?.fullTranslation ? page.text.fullTranslation : 'Translated Text Goes Here'}</div>
      {page.language && 
        <div className="language fixed text-sm sm:text-lg text-white bottom-0 left-0 p-3 bg-gray-600">
          <span>{`Detected: ${new Intl.DisplayNames(['en'], {type: 'language', style: 'long'}).of(page.language)}`}
          </span>
        </div>}
    </div>
  )
}