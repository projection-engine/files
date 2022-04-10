import PropTypes from "prop-types";
import styles from '../styles/Cards.module.css'
import React from "react";
import Item from "./Item";
import useItems from "../hooks/useItems";
import {ContextMenu} from "@f-ui/core";
import SelectBox from "../../../components/selectbox/SelectBox";

export default function Items(props) {
    const {
        currentItem,
        filesToRender, ref,
        options,
        onRename
    } = useItems(props)



    return (
        <div
            ref={ref}
            className={styles.content}
            style={{display: props.hidden ? 'none' : undefined}}
            data-folder-wrapper={props.hook.currentDirectory}

        >

            <ContextMenu
                options={options}
                onContext={(node) => {
                    console.log(node)
                    if (node !== undefined && node !== null && (node.getAttribute('data-file') || node.getAttribute('data-folder'))) {
                        console.log('HERE')
                        const attr = node.getAttribute('data-file') ? node.getAttribute('data-file') : node.getAttribute('data-folder')
                        console.log('HERE', attr)
                        props.setSelected([attr])
                    }
                }}

                className={styles.filesWrapper}
                styles={{padding: props.visualizationType === 2 ? '0' : undefined, gap: props.visualizationType === 2 ? '0' : undefined}}
                triggers={[
                    'data-folder-wrapper',
                    'data-file',
                    'data-folder'
                ]}
            >
                <SelectBox nodes={props.hook.items} selected={props.selected} setSelected={props.setSelected}/>
                {filesToRender.length > 0 ?
                    filesToRender.map((child, index) => (
                        <React.Fragment key={child.id}>
                            <Item
                                index={index}

                                type={child.isFolder ? 0 : 1}
                                data={child}
                                childrenQuantity={child.children}
                                selected={props.selected}
                                setSelected={(e) => props.setSelected(prev => {
                                    if(e.ctrlKey)
                                        return [...prev, child.id]
                                    else
                                        return  [child.id]
                                })}
                                openEngineFile={props.openEngineFile}
                                hook={props.hook}
                                onRename={currentItem}

                                visualizationType={props.visualizationType}
                                submitRename={name => onRename(name, child)}
                            />
                        </React.Fragment>
                    ))

                    :
                    <div className={styles.empty}>
                        <span className={'material-icons-round'} style={{fontSize: '100px'}}>folder</span>
                        <div style={{fontSize: '.8rem'}}>
                            Empty folder
                        </div>
                    </div>}

            </ContextMenu>
        </div>
    )
}

Items.propTypes = {
    visualizationType: PropTypes.number,


    searchString: PropTypes.string,
    selected: PropTypes.array,
    setSelected: PropTypes.func,
    openEngineFile: PropTypes.func.isRequired,
    accept: PropTypes.array,
    hook: PropTypes.object.isRequired,
    setAlert: PropTypes.func.isRequired
}
