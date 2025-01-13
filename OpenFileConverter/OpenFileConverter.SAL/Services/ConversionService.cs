using System.Threading.Tasks;
using Xabe.FFmpeg;
using Xabe.FFmpeg.Downloader;

namespace OpenFileConverter.SAL.Services
{
    public class ConversionService
    {
        public ConversionService()
        {
            FFmpegDownloader.GetLatestVersion(FFmpegVersion.Official).Wait();
        }

        public async Task<string> ConvertMp3ToMp4(string inputFilePath, string outputFilePath)
        {
            var conversion = await FFmpeg.Conversions.FromSnippet.ToMp4(inputFilePath, outputFilePath);
            await conversion.Start();
            return outputFilePath;
        }

        public async Task<string> ConvertMp4ToMp3(string inputFilePath, string outputFilePath)
        {
            var conversion = await FFmpeg.Conversions.FromSnippet.ExtractAudio(inputFilePath, outputFilePath);
            await conversion.Start();
            return outputFilePath;
        }
    }
}