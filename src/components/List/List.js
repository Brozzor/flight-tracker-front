export default function List(props) {

    console.log(props)
    return (
        <div className="-mx-4 mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
              {props.header.map((elem) => (
                <th key={elem} scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                  {elem}
                </th>
                ))}
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {props.listBody.map((elem, i) => (
                <tr key={i}>
                  {elem.map((elem2, k) => (
                    <td key={k} className={`${elem2.class ? elem2.class : ''} px-3 py-4 text-sm`}>{elem2.value}</td>
                  ))}
                  <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <a href="#" className="text-indigo-600 hover:text-indigo-900">
                      Edit<span className="sr-only">ffff</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    )
  }
  