import styles from './styles/Explorer.module.css'
import PropTypes from "prop-types";
import React, {useContext, useEffect, useMemo, useState} from "react";
import Directories from "./components/Directories";
import Items from "./components/Items";
import ImportOptions from "./components/ImportOptions";
import Folder from "./templates/Folder";
import ResizableBar from "../resizable/ResizableBar";
import {Button} from "@f-ui/core";
import useDB from "./hooks/useDB";
import DatabaseProvider from "../db/DatabaseProvider";

export default function Explorer(props) {
    const [selected, setSelected] = useState()
    const [hidden, setHidden] = useState(true)
    const [searchString, setSearchString] = useState('')
    const database = useContext(DatabaseProvider)
    const hook = useDB('Project', props.setAlert, props.id, database)
    const [visualizationType, setVisualizationType] = useState(0)
    useEffect(() => {
        setHidden(true)
    }, [props.currentTab])
    const findParent = (searchFor, searchBase) => {
        let res = []
        const found = searchBase.find(n => n.id === searchFor)
        if (found) {
            if (found.parent)
                res = res.concat([findParent(found.parent, searchBase)])
            res.push(found)
        }
        return res.flat()
    }
    const path = useMemo(() => {
        const folders = hook.items.filter(i => i instanceof Folder)
        return findParent(hook.currentDirectory, folders)
    }, [hook.currentDirectory, hook.items])

    useEffect(() => {
        if (hidden)
            hook.ref.current.previousSibling.previousSibling.style.height = '100%'
    }, [hidden])

    return (
        <>
            <ResizableBar
                type={'height'}

                onResize={() => {
                    if (hidden && hook.ref.current.getBoundingClientRect().height > 35)
                        setHidden(false)
                }}
                onResizeEnd={() => {
                    if (hook.ref.current.getBoundingClientRect().height <= 35)
                        setHidden(true)
                }}/>
            <div className={styles.wrapper} style={{height: hidden ? '35px' : undefined}} ref={hook.ref}>
                <div className={styles.content} style={{width: '20%'}}>
                    <div className={styles.contentWrapper}>
                        <Button clssName={styles.button} onClick={() => setHidden(!hidden)}>
                            <span className={'material-icons-round'}>{hidden ? 'expand_more' : 'expand_less'}</span>
                        </Button>
                        <span className={'material-icons-round'} style={{fontSize: '1.2rem'}}>source</span>
                        <div className={styles.overflow}>
                            Content browser
                        </div>
                    </div>
                    {hidden ? null : <Directories hook={hook} {...props}/>}
                </div>
                <ResizableBar type={'width'} color={'var(--fabric-border-primary)'}/>
                <div className={styles.content}>
                    <div className={styles.contentWrapper} style={{paddingLeft: '8px'}}>
                        <ImportOptions
                            searchString={searchString}
                            visualizationType={visualizationType}
                            setVisualizationType={setVisualizationType}
                            setSearchString={v => {
                                if (hidden)
                                    setHidden(false)
                                setSearchString(v)
                            }}
                            hidden={hidden} hook={hook} setHidden={setHidden} {...props} path={path}
                        />
                    </div>
                    {hidden ? null : <Items

                        {...props} hook={hook}
                        visualizationType={visualizationType}
                        searchString={searchString}
                        setSelected={setSelected}
                        accept={props.accept ? props.accept : []}
                    />}
                </div>

            </div>
        </>
    )
}

Explorer.propTypes = {
    id: PropTypes.string,
    currentTab: PropTypes.number,
    openEngineFile: PropTypes.func.isRequired,

    accept: PropTypes.array,
    label: PropTypes.string,
    setAlert: PropTypes.func.isRequired
}
