import styles from './list.module.css'
import Actions from '@/app/ui/actions/actions'
import Link from 'next/link'

export default function List({
        tableHead=[],
        tableData=[],
        userPermissions=[],
        endpoint='',
        deleteKey = '',
        showActions=false,
        CustomStyles={},
        customClass='',
        showView=true,
        showEdit=true,
        showDelete=true,
        queryString='',
        rowClassName = () => '',
        deleteMsg='Elemento eliminado con éxito',
        cancelSupervisor = false,
        custonActionButton = () => '',
        noRenderKeys = [],
        typeList = 'store',
        editIcon = 'edit',
        editTitle = 'Editar',
        editButtonType = 'warning',
        // Ordenamiento por columna (opt-in): sortableColumns mapea la key de tableHead
        // (la etiqueta de la columna, ej. 'nombre') al nombre real de la columna que
        // el backend acepta para ordenar (ej. 'name'). basePath es el pathname de la
        // página (ej. '/store/products') y sortParams son los filtros actuales que hay
        // que conservar en la URL (ej. la búsqueda), sin el 'page' (al cambiar el orden
        // siempre volvemos a la página 1) ni el sort actual (lo agregamos nosotros).
        sortableColumns = {},
        sortBy = null,
        sortDir = null,
        basePath = '',
        sortParams = ''

    }) {
    // etiquetas en el mismo orden que las columnas, para mostrarlas en la vista
    // de tarjetas en pantallas angostas (ver list.module.css, media query mobile)
    const headerLabels = Object.values(tableHead)

    const buildSortHref = (column, nextDir) => {
        const params = new URLSearchParams(sortParams)
        params.set('sortBy', column)
        params.set('sortDir', nextDir)
        return `${basePath}?${params.toString()}`
    }

    return (
        <div className={`${styles.container} shadow-sm ${customClass}`} style={CustomStyles}>
            <table className={`${styles.table} p3-b`}>
                <thead>
                    <tr>
                        {Object.keys(tableHead).map((key, index) => {
                            if (showActions === false && key === 'actions') {
                                return null
                            }

                            const sortColumn = sortableColumns[key]
                            if (!sortColumn) {
                                return (
                                    <th key={index} scope="col">{tableHead[key]}</th>
                                )
                            }

                            const isActive = sortBy === sortColumn
                            const nextDir = isActive && sortDir === 'asc' ? 'desc' : 'asc'

                            return (
                                <th key={index} scope="col">
                                    <Link
                                        href={buildSortHref(sortColumn, nextDir)}
                                        scroll={false}
                                        className={styles.sortableHeader}
                                    >
                                        {tableHead[key]}
                                        <span className={styles.sortArrow} aria-hidden="true">
                                            {isActive ? (sortDir === 'asc' ? '▲' : '▼') : '⇅'}
                                        </span>
                                    </Link>
                                </th>
                            )

                        })}
                    </tr>
                </thead>
                <tbody>
                   {
                        tableData.map((data, index) => {
                            const dynamicClass = rowClassName(data)
                            const custonButtom = custonActionButton(data)
                            return (
                                <tr key={index} className={dynamicClass}>
                                    {
                                        Object.keys(data).map((key, idx) => {
                                            if (key !== 'id' && !noRenderKeys.includes(key)) {
                                                return (
                                                    <td key={idx} data-label={key} data-label-text={headerLabels[idx] || key}
                                                        style={key === 'name' ? { textTransform: 'capitalize' } : {}}>
                                                        {data[key]}
                                                    </td>
                                                )
                                            }

                                            if (key === 'id' && showActions) {
                                                return (
                                                    <td key={idx} data-label={'actions'} data-label-text={headerLabels[idx] || 'Acciones'}>
                                                        <Actions
                                                            userPermissions={userPermissions}
                                                            endpoint={endpoint}
                                                            resourceId={data[key]}
                                                            deleteKey={deleteKey}
                                                            showView={showView}
                                                            showEdit={showEdit}
                                                            showDelete={showDelete}
                                                            queryString={queryString}
                                                            deleteMsg={deleteMsg}
                                                            cancelSupervisor={cancelSupervisor}
                                                            custonActionButton={custonButtom}
                                                            typeList={typeList}
                                                            editIcon={editIcon}
                                                            editTitle={editTitle}
                                                            editButtonType={editButtonType}
                                                        />
                                                    </td>
                                                )
                                            }
                                        })
                                    }
                                </tr>
                            )
                        })
                   }
                   
                </tbody>
            </table>
        </div>
    )
}
