const Constants = require('./constant')
const fs = require('fs-extra')

module.exports = {
    toUpperCase: (str) => {
        if (str && str.length > 0) {
            const newStr = str
                .toLowerCase()
                .replace(/_([a-z])/, (m) => m.toUpperCase())
                .replace(/_/, '')
            return str.charAt(0).toUpperCase() + newStr.slice(1)
        }
        return ''
    },
    validationMessageKey: (apiTag, error) => {
        let key = module.exports.toUpperCase(error.details[0].context.key)
        let type = error.details[0].type.split('.')
        type = module.exports.toUpperCase(type[1])
        key = apiTag + key + type
        return key
    },
    async excelValidation(req, res, file) {
        return new Promise((resolve) => {
            const extension = file.type
            const fileExtArr = [
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/csv,application/excel',
                'application/vnd.ms-excel',
                'application/vnd.msexcel',
                'application/octet-stream',
                'text/csv',
            ]
            if (file && !fileExtArr.includes(extension)) {
                return Response.errorResponseWithoutData(
                    res,
                    res.__('fileInvalid'),
                    Constants.BAD_REQUEST
                )
            }
            return resolve(true)
        })
    },
    async uploadFiles(file, paths, filename) {
        return new Promise((resolve, reject) => {
            const tempPath = file.path
            const fileName = filename

            // const newLocation = path.join(__dirname, '../../public/uploads') + '/' + paths + '/'
            const newLocation = '/tmp/'
            if (!fs.existsSync(newLocation)) {
                fs.mkdirSync(newLocation, { recursive: true }, () => {})
            }
            fs.copy(tempPath, newLocation + fileName, (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(newLocation + fileName)
                }
            })
        })
    },
}
