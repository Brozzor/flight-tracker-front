const listBody = [
    [ {personality: {name: 'Lindsay Walton'}}, {plane_number: 'JYGUY7'}, {duration: '3 heures'}, {from: 'madrid'}, {to: 'Berlin'} ],
    // More people...
  ]
  
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
              {flights.map((flight) => (
                <tr key={flight.personality.name}>
                  <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-6">
                    {flight.personality.name}
                  </td>
                  <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">{flight.plane_number}</td>
                  <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">{flight.duration}</td>
                  <td className="px-3 py-4 text-sm text-gray-500">{flight.from}</td>
                  <td className="px-3 py-4 text-sm text-gray-500">{flight.to}</td>
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
  