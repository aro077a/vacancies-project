import {
  BoldButton,
  DraftJsButtonTheme,
  HeadlineOneButton,
  HeadlineThreeButton,
  HeadlineTwoButton,
  ItalicButton,
  OrderedListButton,
  UnderlineButton,
  UnorderedListButton,
} from '@draft-js-plugins/buttons';
import classNames from 'classnames';
import {
  ContentBlock,
  ContentState,
  convertFromRaw,
  convertToRaw,
  DraftEditorCommand,
  DraftHandleValue,
  Editor as DraftjsEditor,
  EditorState,
  RawDraftContentState,
  RichUtils,
} from 'draft-js';
import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import styles from './styles.scss';

type Ref = {
  getRawValue: () => string;
};

type Props = {
  label?: string;
  maxLimit?: number;
  className?: string;
  rawContentState?: string;
  readOnly?: boolean;
};

const toolbarButtonTheme: DraftJsButtonTheme = {
  buttonWrapper: styles['editor__toolbar-button-wrapper'],
  button: styles['editor__toolbar-button'],
  active: styles['editor__toolbar-button--active'],
};

const EditorWithForwardedRef = forwardRef<Ref, Props>(
  ({ label, maxLimit, className, rawContentState, readOnly = false }, ref) => {
    const editorRef = useRef<DraftjsEditor>(null);
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

    useEffect(() => {
      try {
        if (rawContentState) {
          const rawContent: RawDraftContentState = JSON.parse(rawContentState);
          const contentState = convertFromRaw(rawContent);

          setEditorState(EditorState.createWithContent(contentState));
        }
        // eslint-disable-next-line no-empty
      } catch (error) {}
    }, [rawContentState]);

    useImperativeHandle(
      ref,
      () => {
        return {
          getRawValue: () => JSON.stringify(convertToRaw(editorState.getCurrentContent())),
        };
      },
      [editorState],
    );

    const focusEditor = useCallback(() => {
      editorRef.current?.focus();
    }, []);

    const getEditorPlainTextLength = useCallback((editorState: EditorState) => {
      return editorState.getCurrentContent().getPlainText().length;
    }, []);

    const handleKeyCommand = useCallback(
      (command: DraftEditorCommand): DraftHandleValue => {
        const newState = RichUtils.handleKeyCommand(editorState, command);

        if (newState) {
          setEditorState(newState);

          return 'handled';
        }

        if (
          command === 'split-block' &&
          maxLimit !== undefined &&
          getEditorPlainTextLength(editorState) >= maxLimit
        ) {
          return 'handled';
        }

        return 'not-handled';
      },
      [editorState, getEditorPlainTextLength, maxLimit],
    );

    const handleBeforeInput = useCallback(
      (chars: string, editorState: EditorState): DraftHandleValue => {
        if (
          maxLimit !== undefined &&
          getEditorPlainTextLength(editorState) + chars.length > maxLimit
        ) {
          return 'handled';
        }

        return 'not-handled';
      },
      [getEditorPlainTextLength, maxLimit],
    );

    const handlePastedText = useCallback(
      (text: string, html: string | undefined, editorState: EditorState): DraftHandleValue => {
        if (
          maxLimit !== undefined &&
          getEditorPlainTextLength(editorState) + text.length > maxLimit
        ) {
          setEditorState(
            EditorState.createWithContent(ContentState.createFromText(text.slice(0, maxLimit))),
          );
          return 'handled';
        }

        return 'not-handled';
      },
      [getEditorPlainTextLength, maxLimit],
    );

    const getEditorState = useCallback(() => {
      return editorState;
    }, [editorState]);

    const getBlockClassName = useCallback((contentBlock: ContentBlock) => {
      const type = contentBlock.getType();

      if (type === 'header-one') {
        return styles['editor__h1-block'];
      }

      if (type === 'header-two') {
        return styles['editor__h2-block'];
      }

      if (type === 'header-three') {
        return styles['editor__h3-block'];
      }

      return styles['editor__default-block'];
    }, []);

    if (readOnly) {
      return (
        <DraftjsEditor
          readOnly
          editorState={editorState}
          onChange={setEditorState}
          blockStyleFn={getBlockClassName}
        />
      );
    }

    return (
      <div className={classNames(styles['editor'], className)}>
        {label && <p className={styles['editor__label']}>{label}</p>}
        <div className={styles['editor__body']} onClick={focusEditor}>
          <DraftjsEditor
            ref={editorRef}
            editorState={editorState}
            onChange={setEditorState}
            handleKeyCommand={handleKeyCommand}
            handleBeforeInput={handleBeforeInput}
            handlePastedText={handlePastedText}
            blockStyleFn={getBlockClassName}
          />
          <div className={styles['editor__toolbar']}>
            <HeadlineOneButton
              theme={toolbarButtonTheme}
              getEditorState={getEditorState}
              setEditorState={setEditorState}
            />
            <HeadlineTwoButton
              theme={toolbarButtonTheme}
              getEditorState={getEditorState}
              setEditorState={setEditorState}
            />
            <HeadlineThreeButton
              theme={toolbarButtonTheme}
              getEditorState={getEditorState}
              setEditorState={setEditorState}
            />
            <BoldButton
              theme={toolbarButtonTheme}
              getEditorState={getEditorState}
              setEditorState={setEditorState}
            />
            <ItalicButton
              theme={toolbarButtonTheme}
              getEditorState={getEditorState}
              setEditorState={setEditorState}
            />
            <UnderlineButton
              theme={toolbarButtonTheme}
              getEditorState={getEditorState}
              setEditorState={setEditorState}
            />
            <OrderedListButton
              theme={toolbarButtonTheme}
              getEditorState={getEditorState}
              setEditorState={setEditorState}
            />
            <UnorderedListButton
              theme={toolbarButtonTheme}
              getEditorState={getEditorState}
              setEditorState={setEditorState}
            />
          </div>
        </div>
        {maxLimit && (
          <p className={styles['editor__remaining-chars-message']}>
            {maxLimit - getEditorPlainTextLength(editorState)} characters remaining
          </p>
        )}
      </div>
    );
  },
);

export const Editor = memo(EditorWithForwardedRef);
