import { RawDraftContentState } from "draft-js"
import { Editor } from "react-draft-wysiwyg"

import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

interface IDescriptionEditorProps {
  description: RawDraftContentState | undefined
  onStateChanged: (contentState: RawDraftContentState) => void
}

const toolBarOptions = {
    options: ['inline', 'blockType', 'list', 'colorPicker', 'link',  'emoji',  'remove', 'history'],
    inline: {
        options: ['bold', 'italic', 'underline']
    },
    blockType: {
        options: ['normal', 'H2']
    }
}

export const DescriptionEditor = (props: IDescriptionEditorProps) => {
  return <Editor
         initialContentState={props.description}
         onContentStateChange={props.onStateChanged}
         toolbar={toolBarOptions}
         wrapperClassName="description-editor-wrapper"
         editorClassName="description-editor"
         toolbarClassName="description-editor-toolbar"
         />
}
