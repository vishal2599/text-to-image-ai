const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const generateImage = async (req, res) => {
    const { prompt, size, n } = req.body;

    const imageSize = size === 'small' ? '256x256' : size === 'medium' ? '512x512' : '1024x1024';
    const numberOfImages = n > 6 ? 6 : n;

    try {
        const response = openai.createImage({
            prompt,
            n: numberOfImages,
            size: imageSize
        });
        const imageUrls = (await response).data.data;
        res.status(200).json({
            success: true,
            data: imageUrls
        })
    } catch (error) {
        if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
          } else {
            console.log(error.message);
          }

        res.status(200).json({
            success: false,
            error: 'The image could not be generated'
        })
    }
}

module.exports = { generateImage }